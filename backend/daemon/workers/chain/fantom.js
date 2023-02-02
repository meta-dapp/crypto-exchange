const {
    Worker,
    connectDB,
    createTransaction,
    processDeposit,
    processWithdraw
} = require('./index')

connectDB.then(() => {
    new Worker('ftm-transactions', async (job) => {
        return await createTransaction(job.data)
    })

    new Worker('ftm-deposits', async (job) => {
        return await processDeposit(job.data)
    })

    new Worker('ftm-withdraws', async (job) => {
        return await processWithdraw(job.data)
    })

})