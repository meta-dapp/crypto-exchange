import Wallet from '../services/wallet';

export default async function createWallet(coinAndChain) {
    try {
        const created = await Wallet.createWallet(coinAndChain)
        if (created && 'data' in created) {
            const { data } = await Wallet.getWalletInfo(created.data.coin)
            if (data) {
                return data
            }
        }
    } catch (err) { }
}