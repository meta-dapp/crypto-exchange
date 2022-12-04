const mongoose = require('mongoose')
const { Schema } = mongoose

const walletContractScheme = Schema({
    address: {
        type: String,
        unique: true,
        required: true
    },
    reserved: {
        type: Boolean,
        default: false
    },
    chainId: Number
})

module.exports = mongoose.model('WalletContract', walletContractScheme)