const appRoot = require('app-root-path')
const ObjectId = require('mongoose').Types.ObjectId
const Transaction = require(`${appRoot}/config/models/Transaction`)
const Wallet = require(`${appRoot}/config/models/Wallet`)
const coins = require(`${appRoot}/config/coins/info`)
const { Queue } = require('bullmq')
const Web3 = require('web3')

let web3

const _updateTransactionState = async (txHash, status, transactionId) => {
    const upsert = {
        status
    }

    if (txHash)
        upsert.txHash = txHash

    await Transaction.updateOne({ _id: ObjectId(transactionId) }, {
        $set: upsert
    })
}

const sendTransaction = async (value, toAddress) => {
    const gasPrice = await web3.eth.getGasPrice()
    const gasPriceHex = web3.utils.toHex(gasPrice)
    const gasLimitHex = web3.utils.toHex(3000000)

    const nonce = await web3.eth.getTransactionCount(process.env.WITHDRAW_FROM_WALLET)
    const transaction = {
        from: web3.utils.toChecksumAddress(process.env.WITHDRAW_FROM_WALLET),
        nonce: web3.utils.toHex(nonce),
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        to: web3.utils.toChecksumAddress(toAddress),
        value
    }

    const signedTx = await web3.eth.accounts.signTransaction(
        transaction,
        process.env.WITHDRAW_FROM_PRIVATE_KEY
    )

    return await web3.eth.sendSignedTransaction(signedTx.rawTransaction)
}

const sendWithdraw = async ({
    walletId, transactionId, amount, withdrawAddress
}) => {
    const wallet = await Wallet.findOne({ _id: ObjectId(walletId) },
        { transactions: 0 })

    if (wallet && 'coin' in wallet) {
        const { coin, chainId } = wallet
        const value = (amount - coins[coin].fee) * 10 ** coins[coin].decimals
        web3 = new Web3(require(`${appRoot}/config/chains/` + chainId).rpc)
        const receipt = await sendTransaction(value, withdrawAddress)
        if (receipt) {
            const { transactionHash, status } = receipt
            await _updateTransactionState(transactionHash, status ? 2 : 4, transactionId)

            const withdrawFrom = new Queue('WithdrawedFromMetaDapp')
            withdrawFrom.add('withdraw', {
                chainId,
                amount,
                withdrawAddress,
                transactionHash,
                transactionId,
                status,
                coin: wallet.coin
            })

            return 'success'
        }
    }

    throw 'error: not processed'
}

module.exports = sendWithdraw