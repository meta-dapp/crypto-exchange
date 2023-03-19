import React, { useState, useEffect } from 'react';
import Wallet from '../services/wallet'
import Price from '../services/price'

export default function useAllWallets() {
    const [allWalletInfo, setAllWalletInfo] = useState([]);
    const [walletBalance, setWalletBalance] = useState(0);

    async function getTotalBalance(info) {
        if (info) {
            var balance = 0
            for (var i = 0; i < info.length; i++) {
                const wallet = info[i]
                const { data } = await Price.getPrice(wallet.coin)
                if (data && 'USD' in data)
                    balance += parseFloat(data.USD) * wallet.balance
            }

            return balance
        }

        return 0
    }

    useEffect(() => {
        async function getAllWalletInfo() {
            try {
                const { data } = await Wallet.getAllWalletInfo()
                if (data) {
                    setAllWalletInfo(data)
                    setWalletBalance(await getTotalBalance(data))
                }
            } catch (err) { }
        }

        getAllWalletInfo()
    }, [])

    return {
        allWalletInfo,
        walletBalance
    }
}