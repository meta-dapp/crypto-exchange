import React, { useState, useEffect } from 'react';
import Wallet from '../services/wallet'

export default function useWalletInfo(coin) {
    const [walletInfo, setWalletInfo] = useState(null);
    const [isInfoLoading, setLoading] = useState(true);

    useEffect(() => {
        async function getWalletInfo() {
            try {
                const { data } = await Wallet.getWalletInfo(coin)
                if (data)
                    setWalletInfo(data)
            } catch (err) { }

            setLoading(false)
        }

        getWalletInfo()
    }, [])

    return {
        walletInfo,
        isInfoLoading,
        setWalletInfo,
        setLoading
    }
}