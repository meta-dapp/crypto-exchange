const appRoot = require('app-root-path')
const ObjectId = require('mongoose').Types.ObjectId
const Web3 = require('web3')
const { sendDepositEmail } = require('../notifications/mailService')

const Transaction = require(`${appRoot}/config/models/Transaction`)
const Wallet = require(`${appRoot}/config/models/Wallet`)
const coins = require(`${appRoot}/config/coins/info`)
const User = require(`${appRoot}/config/models/User`)

let web3

const reject = () => {
    throw 'err: not deposited'
}

const _updateTransactionState = async (tId, status, value, confirmations) => {
    const upsert = {
        status
    }

    if (confirmations) {
        upsert.confirmations = confirmations
    }

    if (value) {
        upsert.amount = value
    }

    await Transaction.updateOne({ _id: ObjectId(tId) }, {
        $set: upsert
    })
}

const _deposit = async (transactionId, chainId, coin, address, value) => {
    var result = await Wallet.updateOne({
        address, coin, chainId
    }, {
        $inc: { balance: value }
    })

    if (result) {
        await _updateTransactionState(transactionId, 3, value)
        const wallet = await Wallet.findOne({
            transactions: ObjectId(transactionId)
        })
        const user = await User.findOne({
            wallets: ObjectId(wallet._id)
        })
        sendDepositEmail(value, coin, user.email)
        return 'deposit'
    } else {
        await _updateTransactionState(transactionId, 4)
        reject()
    }
}

const _checkConfirmation = async (
    address, txHash, value, coin, chainId, transactionId
) => {
    var result = await web3.eth.getTransactionReceipt(txHash)
    if (result && 'status' in result && result.status) {
        return _deposit(
            transactionId, chainId, coin, address, value / 10 ** coins[coin].decimals
        )
    }

    reject()
}

const processDeposit = async (
    { walletAddress, transactionHash, transactionId, chainId, coin }
) => {
    web3 = new Web3(require(`${appRoot}/config/chains/${chainId}`).rpc)
    var result = await Transaction.findOne({ _id: ObjectId(transactionId) })
    if (result) {
        result = await web3.eth.getTransaction(transactionHash)
        if (result && 'value' in result) {
            const { value, blockNumber } = result
            const confirmations = (await web3.eth.getBlockNumber()) - blockNumber
            await _updateTransactionState(
                transactionId,
                2,
                value / 10 ** coins[coin].decimals,
                confirmations
            )
            if (confirmations >= process.env.MIN_CONFIRMATIONS) {
                // registrar
                return await _checkConfirmation(
                    walletAddress,
                    transactionHash,
                    value,
                    coin,
                    chainId,
                    transactionId
                )
            }

            reject()
        }
    }

    reject()
}

module.exports = processDeposit