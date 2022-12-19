const fs = require('fs')
const appRoot = require('app-root-path')
const Config = require('./networkconfig')

const buildNetworks = () => {
    const networks = {}
    const __dir = `${appRoot}/config/chains`
    const files = fs.readdirSync(__dir)

    files.forEach(file => {
        const info = require(`${__dir}/${file}`)
        const network_id = require('path').parse(file).name

        networks[info.name] = Config(
            info.g_address,
            info.g_address_pk,
            network_id,
            info.rpc
        )
    })

    return networks
}

module.exports = buildNetworks()