const chains = require('./chains/get')

module.exports = {
    contracts_build_directory: `contracts/abis`,
    networks: chains,
    compilers: {
        solc: {
            version: '0.8.17',
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 200
                }
            }
        }
    }
}