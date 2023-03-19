import * as React from 'react'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { createTheme } from '@mui/material/styles'
import {
    Avatar,
    Typography,
    Box,
    Button,
    TextField,
    Grid,
    Link
} from '@mui/material'
import useAuth from './../hooks/useAuth'

const theme = createTheme()

export default function Register() {
    const { registerUser, error } = useAuth()

    const handleSubmit = async (event) => {
        event.preventDefault()
        const data = Object.fromEntries(new FormData(event.currentTarget))
        await registerUser(data)
    }

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Registrarse
            </Typography>
            <Box sx={{ width: '30%', mt: 3 }} component="form" noValidate onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            autoComplete="given-name"
                            name="firstName"
                            required
                            fullWidth
                            id="firstName"
                            label="Nombre"
                            autoFocus
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="lastName"
                            label="Apellidos"
                            name="lastName"
                            autoComplete="family-name"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            id="email"
                            label="Correo electrónico"
                            name="email"
                            autoComplete="email"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            required
                            fullWidth
                            name="password"
                            label="Contraseña"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                        />
                    </Grid>
                </Grid>
                {error ? <Typography textAlign='center' marginTop={2} component="h4" color='red'>
                    {error}
                </Typography> : <></>}
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Registrarse
                </Button>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Link href="/login" variant="body2">
                            ¿Ya tienes una cuenta? Inicia sesión
                        </Link>
                    </Grid>
                </Grid>
            </Box>
        </Box >
    )
}