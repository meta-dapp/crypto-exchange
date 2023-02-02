const {
    Worker,
    connectDB,
    createTransaction,
    processDeposit,
    processWithdraw
} = require('./index')

connectDB.then(() => {
    new Worker('avax-transactions', async (job) => {
        return await createTransaction(job.data)
    })

    new Worker('avax-deposits', async (job) => {
        return await processDeposit(job.data)
    })

    new Worker('avax-withdraws', async (job) => {
        return await processWithdraw(job.data)
    })

})