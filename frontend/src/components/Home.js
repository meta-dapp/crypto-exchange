import * as React from 'react';

import {
    Grid,
    Paper,
} from '@mui/material';
import TradeViewChart from 'react-crypto-chart';
import TotalBalance from './TotalBalance';
import MyWallets from './MyWallets';

export default function Home() {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={8} lg={9}>
                <Paper
                    sx={{
                        p: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <TradeViewChart
                        chartLayout={{
                            layout: {
                                backgroundColor: 'white',
                            },
                        }}
                        containerStyle={{
                            height: '240px',
                            minWidth: '400px'
                        }}
                        pair="BTCUSDT" />
                </Paper>
            </Grid>
            <Grid item xs={12} md={4} lg={3}>
                <Paper
                    sx={{
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        height: 240,
                    }}
                >
                    <TotalBalance />
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <MyWallets />
                </Paper>
            </Grid>
        </Grid>
    )
}