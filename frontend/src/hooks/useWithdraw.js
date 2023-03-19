
import Withdraw from '../services/withdraw';

export default function useWithdraw(coin) {
    async function withdraw(amount, account) {
        try {
            const { data } = await Withdraw.process(coin, amount, account)
            if (data && 'data' in data)
                return data.data
        } catch (err) { }
    }

    return {
        withdraw
    }
}