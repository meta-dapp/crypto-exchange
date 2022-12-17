const GeneratorFactoryContract = require('../contracts/abis/GeneratorFactoryContract')
const Web3 = require('web3')

const HDWalletProvider = require('@truffle/hdwallet-provider')
const privateKeys = [process.env.GENERATOR_PRIVATE_KEY]

class GeneratorFactory {
    constructor(rpc) {
        this.web3 = new Web3(
            new HDWalletProvider(
                privateKeys,
                rpc
            ))
    }

    async generate() {
        const contract = await GeneratorFactoryContract(this.web3.currentProvider)
        return await contract.generate({ from: process.env.GENERATOR_ADDRESS })
    }
}

module.exports = GeneratorFactory