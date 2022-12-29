const {
    Worker,
    connectDB,
    createTransaction
} = require('./index')

connectDB.then(() => {
    new Worker('bnb-transactions', async (job) => {
        return await createTransaction(job.data)
    })

})