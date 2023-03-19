import * as React from 'react'
import {
    Typography,
    Box,
    Paper,
    Grid,
    IconButton,
    Divider,
    Stack,
    Input,
    Tooltip,
    Zoom,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material'
import { CopyToClipboard } from "react-copy-to-clipboard";

import CopyIcon from "../assets/receiveCopyIcon.svg";
import QRCode from "react-qr-code";
import useWalletInfo from '../hooks/useWalletInfo'
import useCoinPrice from '../hooks/useCoinPrice'
import { useParams } from 'react-router-dom'
import {
    getCoinDecimalsPlace,
    getCoinFee,
    getDefaultNetworkId,
    getNetWorkList,
    getNetworkName
} from '../components/utils/Chains'

import useWithdraw from '../hooks/useWithdraw';
import createWallet from '../hooks/createWallet';
import CoinTransactions from '../components/CoinTransactions';
import useTransitions from '../hooks/useTransactions'

export default function Wallet() {
    const [copied, setCopied] = React.useState(false);
    const [withdrawAmount, setWithdrawAmount] = React.useState(0);
    const [withdrawAddress, setWithdrawAddress] = React.useState(undefined);

    const { walletId } = useParams();
    const defaultNetworkId = getDefaultNetworkId(walletId)

    const { walletInfo, isWalletLoading, setWalletInfo } = useWalletInfo(walletId);
    const { coinPrice } = useCoinPrice(walletId);
    const { withdraw } = useWithdraw(walletId);

    const { transactions, getTransactions } = useTransitions(walletId);

    const handleWithdraw = async () => {
        const result = await withdraw(withdrawAmount, withdrawAddress)
        if (result && result === 'success') {
            getTransactions()
        }
    }

    const handleInputAddress = (e) => {
        setWithdrawAddress(e.target.value)
    }

    const handleInputAmount = (e) => {
        setWithdrawAmount(e.target.value)
    }

    const truncateToDecimals = (num, dec) => {
        const calcDec = Math.pow(10, dec);
        return Math.trunc(num * calcDec) / calcDec;
    }

    const handleCreateWallet = async (e) => {
        const wallet = await createWallet({
            coin: walletId,
            chainId: defaultNetworkId
        })

        if (wallet) {
            setWalletInfo(wallet)
        }
    }

    return (
        <Grid container spacing={2} columns={16}>
            <Grid item xs={10}>
                <CoinTransactions
                    transactions={transactions}
                    chainId={defaultNetworkId}
                    coin={walletId} />
            </Grid>
            <Grid item xs={6}>
                <Paper sx={{ p: 2 }}>
                    <React.Fragment>
                        <Box>
                            {!isWalletLoading ?
                                walletInfo ?
                                    <>
                                        <Typography variant="body2" color="text.secondary" mb={1}>
                                            Balance
                                        </Typography>
                                        <Typography variant="h4" fontWeight={500} mb={1}>
                                            {truncateToDecimals(walletInfo.balance, getCoinDecimalsPlace(walletInfo.coin))}
                                            <Typography
                                                component="span"

                                                variant="h3"
                                                fontWeight={500}
                                            >
                                                {` ${walletInfo.coin}`}
                                            </Typography>
                                        </Typography>
                                        <Typography variant="body1" color="text.secondary" mb={2}>
                                            {coinPrice ?
                                                `$${(parseFloat(walletInfo.balance) * parseFloat(coinPrice)).toFixed(2)}`
                                                : ''}
                                        </Typography>
                                        <Divider />
                                        <Box>
                                            <Box marginTop={3}>
                                                <FormControl fullWidth disabled>
                                                    <InputLabel id="select-network-label">
                                                        {`Selecciona la red para ${walletId.toUpperCase()}`}
                                                    </InputLabel>
                                                    <Select
                                                        labelId="select-network-label"
                                                        id="select-network"
                                                        value={defaultNetworkId}
                                                        label={`Selecciona la red para ${walletId.toUpperCase()}`}
                                                    >
                                                        {
                                                            getNetWorkList(walletId).map((network) => {
                                                                return <MenuItem key={network.id} value={network.id}>{network.name}</MenuItem>
                                                            })
                                                        }
                                                    </Select>
                                                </FormControl>
                                            </Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Tu dirección de {walletInfo.coin} ({getNetworkName(walletInfo.chainId)})
                                            </Typography>
                                            <Stack direction="row" alignItems="center" spacing={2} my={2}>
                                                <Box
                                                    sx={{ p: "5px" }}
                                                    bgcolor={"#f5f5f5"}
                                                    width={"100%"}
                                                    borderRadius={"4px"}
                                                >
                                                    <Stack
                                                        direction="row"
                                                        alignItems="center"
                                                        justifyContent="space-between"
                                                    >
                                                        <Input
                                                            disableUnderline
                                                            value={walletInfo.address}
                                                            readOnly
                                                            fullWidth
                                                        />
                                                        <CopyToClipboard
                                                            text={walletInfo.address}
                                                            onCopy={() => setCopied(true)}
                                                        >
                                                            <Tooltip
                                                                title={
                                                                    copied ? (
                                                                        <Typography variant="caption" color="text.success">
                                                                            Dirección copiada!
                                                                        </Typography>
                                                                    ) : (
                                                                        "Copiar"
                                                                    )
                                                                }
                                                                TransitionComponent={Zoom}
                                                            >
                                                                <IconButton>
                                                                    <img
                                                                        src={CopyIcon}
                                                                        alt="Scan QR"
                                                                        style={{ width: "100%", height: "100%" }}
                                                                    />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </CopyToClipboard>
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                            <Divider />
                                            <Box margin={5} textAlign={'center'}>
                                                <QRCode value={walletInfo.address} />
                                            </Box>
                                        </Box>
                                        <Box marginBottom={2} marginLeft={2} textAlign={'center'} >
                                            <Grid container columns={6}>
                                                <Grid item xs={4}>
                                                    <Input
                                                        value={withdrawAddress || ''}
                                                        onChange={handleInputAddress}
                                                        placeholder={`Dirección ${getNetworkName(walletInfo.chainId)}...`}
                                                        fullWidth
                                                    />
                                                </Grid>

                                                <Grid item xs={2}>
                                                    <Button
                                                        disabled={!(withdrawAmount > 0 && withdrawAmount <= walletInfo.balance && withdrawAddress)}
                                                        onClick={handleWithdraw}
                                                        variant="contained" color="error">
                                                        RETIRAR
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Box marginBottom={2} marginLeft={2} textAlign={'center'} >
                                            <Grid container columns={6}>
                                                <Grid item xs={3}>
                                                    <Input
                                                        type='number'
                                                        onChange={handleInputAmount}
                                                        value={withdrawAmount || ''}
                                                        placeholder={`Monto a retirar...`}
                                                        fullWidth
                                                    />
                                                </Grid>
                                                <Grid item xs={3}>
                                                    <Typography textAlign='left' variant="caption" color="text.secondary">
                                                        Comisión: {getCoinFee(walletInfo.coin)} {walletInfo.coin}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                    </>
                                    : <Button

                                        onClick={handleCreateWallet}
                                        color="info">
                                        CREAR BILLETERA PARA {walletId.toUpperCase()} AHORA
                                    </Button>
                                :
                                <>Cargando...</>
                            }
                        </Box>
                    </React.Fragment>
                </Paper>
            </Grid>
        </Grid>
    )

}
