import { post, withdrawApi } from '../api/http'

export default class Withdraw {
    static async process(coin, amount, account) {
        return await post(withdrawApi,
            {
                coin,
                amount: parseFloat(amount),
                to: account
            })
    }
}