const mongoose = require('mongoose')

const transactionScheme = mongoose.Schema({
    nature: {
        type: Number,
        required: true,
        index: true
    },
    txHash: {
        type: String,
        index: true,
    },
    amount: Number,
    created_at: {
        type: Date,
        required: false,
        default: Date.now
    },
    to: String,
    confirmations: {
        type: Number,
        default: 0
    },
    status: {
        type: Number,
        required: false,
        default: 1,
        index: true
    } //1. Aprobando, 2. Procesando, 3. Procesado, 4. Cancelado
})

module.exports = mongoose.model('Transaction', transactionScheme)