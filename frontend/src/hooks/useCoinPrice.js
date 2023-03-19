import { useState, useEffect } from 'react';
import Price from '../services/price'

export default function useCoinPrice(coin) {
    const [coinPrice, setCoinPrice] = useState(null);

    useEffect(() => {
        async function getCoinPrice() {
            try {
                const { data } = await Price.getPrice(coin)
                if (data && 'USD' in data)
                    setCoinPrice(data.USD)
            } catch (err) { }
        }

        getCoinPrice()
    }, [])

    return {
        coinPrice
    }
}