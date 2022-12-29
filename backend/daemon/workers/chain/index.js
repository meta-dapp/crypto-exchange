const appRoot = require('app-root-path')
require('dotenv').config({ path: `${appRoot}/config/.env` })
const { Worker } = require('bullmq')
const createTransaction = require(`${appRoot}/jobs/deposits/transaction`)
const connectDB = require(`${appRoot}/config/db/getMongoose`)

module.exports = {
    Worker,
    connectDB,
    createTransaction
}