import { Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { QueryDto } from './dto/query.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../user/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { Wallet, WalletDocument } from './schemas/wallet.schema';
import { WalletContract, WalletContractDocument } from './schemas/wallet-contract.schema';
import { WithdrawDto } from './dto/withdraw.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { default as QueueType } from './queue/types.queue'
import { Queue } from 'bullmq';
import { uuid } from 'uuidv4';
import { Transaction, TransactionDocument } from '../transaction/schemas/transaction.schema';

@Injectable()
export class WalletService {

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Wallet.name) private walletModel: Model<WalletDocument>,
    @InjectModel(WalletContract.name) private walletContractModel: Model<WalletContractDocument>,
    @InjectModel(Transaction.name) private transactionModel: Model<TransactionDocument>,
    @InjectQueue(QueueType.WITHDRAW_REQUEST) private withdrawQueue: Queue
  ) { }

  async create(createWalletDto: CreateWalletDto) {
    let data = await this.userModel.aggregate([
      { $match: { email: createWalletDto.email } },
      { $unwind: '$wallets' },
      { $project: { _id: 0 } },
      {
        $lookup: {
          from: 'wallets',
          localField: 'wallets',
          foreignField: '_id',
          as: 'walletsData',
          pipeline: [
            {
              $match: {
                coin: createWalletDto.coin,
                chainId: createWalletDto.chainId
              }
            }
          ]
        }
      }
    ]).exec();

    let exists = true;
    if (!data || data.length === 0)
      exists = false;

    let wallet = exists ? data.find(w => w.walletsData.length > 0) : undefined;
    if (wallet) {
      wallet = wallet.walletsData[0];
      return {
        address: wallet.address,
        chainId: wallet.chainId,
        coin: wallet.coin,
        walletId: wallet._id
      }
    } else {
      // no tiene wallet
      const data = await this.walletContractModel.findOneAndUpdate(
        { chainId: createWalletDto.chainId, reserved: false },
        { reserved: true }
      );

      if (data) {
        const wallet = new this.walletModel({
          address: data.address,
          chainId: createWalletDto.chainId,
          coin: createWalletDto.coin
        });

        const saved = await wallet.save();
        if (saved) {
          const result = await this.userModel.updateOne({
            email: createWalletDto.email
          }, {
            $push: { wallets: wallet }
          });

          if (result) {
            return {
              address: wallet.address,
              chainId: wallet.chainId,
              coin: wallet.coin,
              walletId: wallet._id
            }
          }
        }
      }
    }
  }

  async getWallet(email: string, queryDto: QueryDto) {
    const data = await this.userModel.aggregate([
      { $match: { email } },
      { $unwind: '$wallets' },
      { $project: { _id: 0 } },
      {
        $lookup: {
          from: 'wallets',
          localField: 'wallets',
          foreignField: '_id',
          as: 'walletsData',
          pipeline: [
            {
              $match: { coin: queryDto.coin }
            }
          ]
        }
      }
    ]).exec();

    if (data && data.length > 0) {
      let wallet = data.find(w => w.walletsData.length > 0)
      if (wallet) {
        wallet = wallet.walletsData[0];
        const data = await this.walletModel.findOne(
          { _id: new Types.ObjectId(wallet._id) },
          { _id: 0, transactions: 0, __v: 0 }
        ).exec();

        if (data) {
          return data;
        }
      }
    }
  }

  async getWallets(email: string) {
    const data = await this.userModel.aggregate([
      { $match: { email } },
      { $unwind: '$wallets' },
      { $project: { _id: 0, wallets: 1 } },
      {
        $lookup: {
          from: "wallets",
          localField: "wallets",
          foreignField: "_id",
          "pipeline": [
            { "$project": { transactions: 0 } }
          ],
          as: "walletsData"
        }
      }
    ]).exec();


    if (data && data.length > 0) {
      return data.map(wallet => {
        return {
          balance: wallet.walletsData[0].balance,
          address: wallet.walletsData[0].address,
          coin: wallet.walletsData[0].coin,
          chainId: wallet.walletsData[0].chainId,
          walletId: wallet.walletsData[0]._id
        }
      })
    }
  }

  async withdraw(withdrawDto: WithdrawDto) {
    const data = await this.userModel.aggregate([
      { $match: { email: withdrawDto.email } },
      { $unwind: '$wallets' },
      { $project: { _id: 0 } },
      {
        $lookup: {
          from: "wallets",
          localField: "wallets",
          foreignField: "_id",
          as: "walletsData",
          pipeline: [
            {
              $match: { coin: withdrawDto.coin }
            }
          ]
        }
      }
    ]).exec();

    if (data && data.length > 0) {
      let wallet = data.find(w => w.walletsData.length > 0)
      if (wallet) {
        wallet = wallet.walletsData[0];
        const data = await this.walletModel.findOne(
          { _id: new Types.ObjectId(wallet._id) },
          { _id: 0, transactions: 0, __v: 0 }
        ).exec();

        if (data && data.balance >= withdrawDto.amount) {
          const transaction = new this.transactionModel({
            nature: 2,
            amount: -1 * withdrawDto.amount,
            created_at: Date.now(),
            status: 1,
            txHash: uuid(),
            to: withdrawDto.to
          });

          const saved = await transaction.save();

          if (saved) {
            const result = await this.walletModel.updateOne(
              { _id: new Types.ObjectId(wallet._id) },
              {
                $push: { transactions: transaction },
                $inc: { balance: transaction.amount }
              });

            if (result) {
              await this.withdrawQueue.add('request', {
                transactionId: transaction._id.toString(),
                walletId: wallet._id.toString(),
                amount: withdrawDto.amount,
                withdrawAddress: withdrawDto.to,
              });

              return {
                error: null,
                data: 'success'
              };
            }
          }
        } else {
          return {
            error: true,
            msg: 'Insuficient balance'
          };
        }

      }
    }
  }
}