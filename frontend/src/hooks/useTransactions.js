import { useState, useEffect } from 'react';
import Transaction from '../services/transaction'

export default function useTransitions(coin) {
    const [transactions, setTransactions] = useState([]);

    async function getTransactions() {
        try {
            let { data } = coin ? await Transaction.getCoinTransactions(coin)
                : await Transaction.getAllTransactions()

            if (data)
                setTransactions(data)
        } catch (err) { }
    }

    useEffect(() => {
        getTransactions()
    }, [])

    return {
        transactions,
        getTransactions
    }
}