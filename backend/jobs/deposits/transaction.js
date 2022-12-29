const appRoot = require('app-root-path')
const Transaction = require(`${appRoot}/config/models/Transaction`)
const Wallet = require(`${appRoot}/config/models/Wallet`)
//const { Queue } = require('bullmq')
const { v4: uuidv4 } = require('uuid')

const createTransaction
    = async ({ walletAddress, transactionHash, chainId, coin }) => {
        const transaction = new Transaction({
            nature: 1,
            created_at: Date.now(),
            txHash: transactionHash
        })

        var result = await transaction.save()
        if (result) {
            result = await Wallet.updateOne({
                address: walletAddress,
                chainId,
                coin: coin.toUpperCase()
            }, {
                $push: {
                    transactions: transaction
                }
            })

            return 'deposit'
        }

        throw 'err: not processed'
    }

module.exports = createTransaction