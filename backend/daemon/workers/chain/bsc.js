const {
    Worker,
    connectDB,
    createTransaction,
    processDeposit
} = require('./index')

connectDB.then(() => {
    new Worker('bnb-transactions', async (job) => {
        return await createTransaction(job.data)
    })

    new Worker('bnb-deposits', async (job) => {
        return await processDeposit(job.data)
    })

})