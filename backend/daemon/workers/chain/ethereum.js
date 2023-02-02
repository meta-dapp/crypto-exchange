const {
    Worker,
    connectDB,
    createTransaction,
    processDeposit,
    processWithdraw
} = require('./index')

connectDB.then(() => {
    new Worker('eth-transactions', async (job) => {
        return await createTransaction(job.data)
    })

    new Worker('eth-deposits', async (job) => {
        return await processDeposit(job.data)
    })

    new Worker('eth-withdraws', async (job) => {
        return await processWithdraw(job.data)
    })

})