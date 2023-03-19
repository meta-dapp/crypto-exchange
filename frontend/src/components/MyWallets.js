import * as React from 'react'
import useAllWallets from '../hooks/useAllWallets'
import {
    Typography,
    Link,
    TableRow,
    TableHead,
    TableCell,
    TableBody,
    Table,
    Grid,
} from '@mui/material';
import { getCoinLogo } from './utils/Chains';
import { getDisplayableAddress } from './utils/Display';

export default function MyWallets() {
    const { allWalletInfo } = useAllWallets();

    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Moneda</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Balance</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {allWalletInfo.map((wallet) => (
                    <TableRow key={wallet.walletId}>
                        <TableCell>
                            <Link color='inherit' underline='none' href={`/wallet/${wallet.coin.toLowerCase()}`}>
                                <Grid container columns={3}>
                                    <Grid item xs={1}>
                                        <img width={25} src={getCoinLogo(wallet.coin)} />
                                    </Grid>
                                    <Grid item xs={2} alignItems='center' alignContent={'center'}>
                                        <Typography alignItems='center' marginTop={'2%'}>
                                            {wallet.coin}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Link>
                        </TableCell>
                        <TableCell>
                            <Link underline='none' href={`/wallet/${wallet.coin.toLowerCase()}`}>

                                {
                                    getDisplayableAddress(wallet.address)
                                }
                            </Link>
                        </TableCell>
                        <TableCell>{wallet.balance}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}