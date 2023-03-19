import { get, transactionsApi, transactionApi } from '../api/http'

export default class Transaction {
    static async getCoinTransactions(coin) {
        return await get(transactionsApi,
            {
                coin
            })
    }

    static async getTransaction(transactionId) {
        return await get(transactionApi,
            {
                transactionId
            })
    }
}