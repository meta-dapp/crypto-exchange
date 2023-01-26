const appRoot = require('app-root-path')
const ObjectId = require('mongoose').Types.ObjectId
const Transaction = require(`${appRoot}/config/models/Transaction`)
const Wallet = require(`${appRoot}/config/models/Wallet`)
const User = require(`${appRoot}/config/models/User`)
const coins = require(`${appRoot}/config/coins/info`)
const Web3 = require('web3')
const { sendWithdrawEmail } = require('../notifications/mailService')

let web3

const reject = () => {
    throw 'error: not withdrawed'
}

const _updateTransactionState = async (tId, status, confirmations) => {
    const upsert = {
        status
    }

    if (confirmations)
        upsert.confirmations = confirmations

    await Transaction.updateOne({ _id: ObjectId(tId) }, {
        $set: upsert
    })
}

const _checkConfirmation = async (address, txHash, value, coin, chainId, transactionId) => {
    var result = await web3.eth.getTransactionReceipt(txHash)
    if (result && 'status' in result && result.status) {
        await _updateTransactionState(transactionId, 3)
        const wallet = await Wallet.findOne({ transactions: ObjectId(transactionId) })
        const user = await User.findOne({ wallets: ObjectId(wallet._id) })
        sendWithdrawEmail(value / 10 ** coins[coin.toUpperCase()].decimals, coin, address, txHash, user.email)
        return 'withdrawed'
    }

    reject()
}

const processWithdraw = async ({
    walletAddress, transactionHash, transactionId, chainId, coin
}) => {
    web3 = new Web3(require(`${appRoot}/config/chains/` + chainId).rpc)
    var result = await Transaction.findOne({ _id: ObjectId(transactionId) })
    if (result) {
        result = await web3.eth.getTransaction(transactionHash)
        if (result && 'value' in result) {
            const { value, blockNumber } = result
            const confirmations = (await web3.eth.getBlockNumber()) - blockNumber
            await _updateTransactionState(transactionId, 2, confirmations)
            if (confirmations >= process.env.MIN_CONFIRMATIONS) {
                return await _checkConfirmation(
                    walletAddress, transactionHash, value, coin, chainId, transactionId
                )
            }

            reject()
        }
    }

    reject()
}

module.exports = processWithdraw