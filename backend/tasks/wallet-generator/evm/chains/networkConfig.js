const appRoot = require('app-root-path')
require('dotenv').config({ path: `${appRoot}/config/.env` })

const HDWalletProvider = require('@truffle/hdwallet-provider')

module.exports = (
    walletAddress,
    privateKeys,
    network_id,
    url
) => {
    return {
        network_id,
        provider: () => new HDWalletProvider(
            privateKeys,
            url
        ),
        from: walletAddress,
        gas: 5000000,
        confirmations: 4,
        timeoutBlocks: 10000
    }
}