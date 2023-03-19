const getNetworkName = (chainId) => {
    return getNetWorkList().find(network => network.id === chainId).name
}

const getCoinList = () => {
    return [
        'bnb',
        'avax',
        'ftm',
        'eth',
        'matic'
    ]
}

const getCoinLogo = (coin) => {
    const baseApi = 'https://cryptologos.cc/logos'
    return {
        bnb: `${baseApi}/bnb-bnb-logo.png`,
        avax: `${baseApi}/avalanche-avax-logo.png`,
        eth: `${baseApi}/ethereum-eth-logo.png`,
        matic: `${baseApi}/polygon-matic-logo.png`,
        ftm: `${baseApi}/fantom-ftm-logo.png`
    }[coin.toLowerCase()]
}

const getDefaultCoin = () => {
    return getCoinList()[0]
}

const getNetWorkList = (coin) => {
    const networks = [
        {
            id: 97,
            name: 'Binance Smart Chain',
            abbr: 'bsc',
            coin: 'bnb',
            explorerBase: 'https://testnet.bscscan.com/tx/'
        },
        {
            id: 43113,
            name: 'Avalanche',
            abbr: 'avalanche',
            coin: 'avax',
            explorerBase: 'https://testnet.snowtrace.io/tx/'
        },
        {
            id: 5,
            name: 'Ethereum',
            abbr: 'ethereum',
            coin: 'eth',
            explorerBase: 'https://goerli.etherscan.io/tx/'
        },
        {
            id: 4002,
            name: 'Fantom',
            abbr: 'fantom',
            coin: 'ftm',
            explorerBase: 'https://testnet.ftmscan.com/tx/'
        },
        {
            id: 80001,
            name: 'Polygon',
            abbr: 'polygon',
            coin: 'matic',
            explorerBase: 'https://mumbai.polygonscan.com/tx/'
        }
    ]

    return coin ?
        networks.filter(network => network.coin === coin.toLowerCase())
        : networks
}

const getDefaultNetworkId = (coin) => {
    return {
        bnb: 97,
        avax: 43113,
        eth: 5,
        ftm: 4002,
        matic: 80001
    }[coin.toLowerCase()]
}

const getNetworkExplorerBase = (chainId) => {
    return getNetWorkList().find(network => network.id === chainId).explorerBase
}

const getCoinFee = (coin) => {
    switch (coin.toUpperCase()) {
        case 'BNB': return 0.005;
        case 'AVAX': return 0.1;
        case 'ETH': return 0.005;
        case 'MATIC': return 0.1;
        case 'FTM': return 0.5;
    }
}

const getCoinDecimalsPlace = (coin) => {
    switch (coin.toUpperCase()) {
        case 'BNB': return 8;
        case 'AVAX': return 4;
        case 'ETH': return 8;
        case 'MATIC': return 2;
        case 'FTM': return 2;
    }

    return 8;
}

export {
    getNetworkName,
    getCoinFee,
    getNetworkExplorerBase,
    getNetWorkList,
    getDefaultNetworkId,
    getCoinList,
    getDefaultCoin,
    getCoinLogo,
    getCoinDecimalsPlace
}