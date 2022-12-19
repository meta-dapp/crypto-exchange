const GeneratorFactoryContract = require('../contracts/abis/GeneratorFactoryContract')
const Web3 = require('web3')

const HDWalletProvider = require('@truffle/hdwallet-provider')

class GeneratorFactory {
    constructor(rpc, privateKeys) {
        this.web3 = new Web3(
            new HDWalletProvider(
                privateKeys,
                rpc
            ))
    }

    async generate(address) {
        const contract = await GeneratorFactoryContract(this.web3.currentProvider)
        return await contract.generate({ from: address })
    }
}

module.exports = GeneratorFactory