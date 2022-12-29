const appRoot = require('app-root-path')
require('dotenv').config({ path: `${appRoot}/config/.env` })
const { Queue } = require('bullmq')
const Web3 = require('web3')
const Wallet = require(`${appRoot}/config/models/Wallet`)
const { v4: uuidv4 } = require('uuid')

const connectDB = require(`${appRoot}/config/db/getMongoose`)

const getWeb3WssInstance = (wss) => {
    return new Web3(new Web3.providers
        .WebsocketProvider(wss))
}

module.exports = {
    Queue,
    Wallet,
    uuidv4,
    connectDB,
    getWeb3WssInstance
}