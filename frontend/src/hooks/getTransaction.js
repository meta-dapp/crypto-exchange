import Transaction from "../services/transaction"

export default async function getTransaction(transactionId) {
    try {
        let { data } = await Transaction.getTransaction(transactionId)
        if (data)
            return data
    } catch (err) { }
}