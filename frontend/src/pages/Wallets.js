import * as React from 'react'
import useAllWallets from '../hooks/useAllWallets'

import {
    Typography,
    Paper,
    Box,
    Grid,
    Button,
    Divider,
    Select,
    FormControl,
    InputLabel,
    MenuItem
} from '@mui/material';
import {
    getCoinList, getDefaultCoin,
    getCoinLogo, getDefaultNetworkId,
    getNetworkName
} from '../components/utils/Chains';
import { useHistory } from "react-router-dom";
import MyWallets from '../components/MyWallets';

export default function Wallets() {
    const history = useHistory();
    const { walletBalance } = useAllWallets();
    const defaultCoin = getDefaultCoin()
    const [selectedCoin, setSelectedCoin] = React.useState(defaultCoin);

    const handleCoinChange = (e) => {
        setSelectedCoin(e.target.value)
    }

    const handleCreateWallet = (e) => {
        history.push(`/wallet/${selectedCoin}`);
    }

    return (
        <React.Fragment>
            <Grid container spacing={2} columns={16}>
                <Grid item xs={10}>
                    <Paper sx={{
                        p: 2
                    }}> <MyWallets />
                    </Paper>
                </Grid>
                <Grid item xs={6}>
                    <Paper sx={{
                        p: 2
                    }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary" mb={1}>
                                Balance Total
                            </Typography>
                            <Typography variant="h3" fontWeight={500} mb={1}>
                                {'$'}{parseFloat(walletBalance).toFixed(2)}
                            </Typography>
                            <Divider />
                        </Box>
                        <Box marginTop={4} marginBottom={2}>
                            <FormControl fullWidth>
                                <InputLabel id="select-coin-label">
                                    {`Selecciona una moneda`}
                                </InputLabel>
                                <Select
                                    labelId="select-coin-label"
                                    id="select-coin"
                                    value={selectedCoin}
                                    onChange={handleCoinChange}
                                    label={`Selecciona una moneda`}
                                >
                                    {
                                        getCoinList().map((coin) => {
                                            return <MenuItem sx={{ p: 2 }} key={coin} value={coin}>
                                                <Grid container columns={8}>
                                                    <Grid item xs={1}>
                                                        <img width={25} src={getCoinLogo(coin)} />
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        {coin.toUpperCase()} &bull; {getNetworkName(getDefaultNetworkId(coin))}
                                                    </Grid>
                                                </Grid>
                                            </MenuItem>
                                        })
                                    }
                                </Select>
                            </FormControl>
                        </Box>
                        <Box>
                            <Button
                                onClick={handleCreateWallet}
                                color="info">
                                IR A MI BILLETERA ({selectedCoin.toUpperCase()})
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <Box margin={3}></Box>
        </React.Fragment>
    )
}