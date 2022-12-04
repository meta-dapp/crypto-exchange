const mongoose = require('mongoose')
const { Schema } = mongoose

const walletScheme = Schema({
    balance: {
        type: Number,
        required: false,
        default: 0
    },
    address: {
        type: String,
        required: true,
        index: true
    },
    coin: String,
    chainId: Number,
    transactions: [{ type: Schema.Types.ObjectId, ref: 'Transaction' }]
})

module.exports = mongoose.model('Wallet', walletScheme)