const appRoot = require('app-root-path')
require('dotenv').config({ path: `${appRoot}/config/.env` })
const { Worker, Queue } = require('bullmq')
const { v4: uuidv4 } = require('uuid')
const connectDB = require(`${appRoot}/config/db/getMongoose`)

connectDB.then(() => {
    new Worker('WithdrawedFromMetaDapp', async (job) => {
        const { withdrawAddress, transactionHash, transactionId, amount, coin, chainId } = job.data
        const withDrawQueue = new Queue(`${coin.toLowerCase()}-withdraws`)
        withDrawQueue.add('withdraw', {
            walletAddress: withdrawAddress,
            transactionHash,
            coin,
            transactionId,
            chainId,
            amount,
            uuid: uuidv4()
        }, {
            attempts: 20,
            backoff: {
                type: 'exponential',
                delay: 5000,
            }
        })

        return 'success'
    })
})