import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import Title from './utils/Title';
import useAllWallets from '../hooks/useAllWallets';

export default function TotalBalance() {
    const { walletBalance } = useAllWallets();

    return (
        <React.Fragment>
            <Title>Balance Total</Title>
            <Typography component="p" variant="h4">
                ${parseFloat(walletBalance).toFixed(2)}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                de todas tus criptomonedas
            </Typography>
            <div>
                <Link color="primary" href="/wallets">
                    Tu billetera
                </Link>
            </div>
        </React.Fragment>
    );
}