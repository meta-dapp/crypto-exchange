import { get, priceApi } from '../api/http'

export default class Wallet {
    static async getPrice(coin) {
        return await get(`${priceApi}${coin.toUpperCase()}`)
    }
}