const GeneratorFactoryContract = artifacts.require('GeneratorFactoryContract')

module.exports = function (deployer) {
    deployer.deploy(GeneratorFactoryContract)
}