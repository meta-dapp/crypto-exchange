const appRoot = require('app-root-path')
require('dotenv').config({ path: `${appRoot}/config/.env` })
const { sleep } = require(`${appRoot}/config/utils/lock`)

const connectDB = require(`${appRoot}/config/db/getMongoose`)
const WalletContract = require(`${appRoot}/config/models/WalletContract`)
const GeneratorFactory = require('./factories/generatorFactory')

var amount = process.argv[2] || 0
const network = process.argv[3] || 97

const { rpc } = require(`${appRoot}/config/chains/${network}`)

connectDB.then(async () => {
    console.log('Loading contract...')
    const generatorFactory = new GeneratorFactory(rpc)
    while (amount > 0) {
        console.log('Generating wallet... ', 'Remain: ', amount - 1)
        const res = await generatorFactory.generate()
        const result = JSON.parse(
            JSON.stringify(res.logs[0].args).replace('Result', '').trim()
        )
        console.log(`Saving wallet: ${result.wallet}`)
        const walletContract = new WalletContract({
            address: result.wallet,
            chainId: network
        })
        await walletContract.save()
        amount--
        await sleep(3000)
    }

    process.exit()
})