import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    MenuItem,
    Menu,
    Avatar,
    Tooltip,
    Toolbar,
    AppBar as MuiAppBar,
    Box,
    Typography,
    IconButton,
    Link
} from '@mui/material';

import useAuth from '../hooks/useAuth';
import { AuthContext } from '../hooks/AuthContext';
import { useHistory } from 'react-router-dom';

const drawerWidth = 0;

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));


function DashboardContent() {
    const { auth } = React.useContext(AuthContext);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const { logoutUser } = useAuth()
    const history = useHistory();
    let settings = []

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleClickUserMenu = async (event) => {
        if (event.target.innerHTML === 'Logout') {
            await logoutUser()
            window.location.reload(false)
        }

        if (event.target.innerHTML === 'Mi billetera') {
            history.push('/wallets')
        }

        setAnchorElUser(null)
    }

    if (auth) {
        settings = [`Hi, ${auth.firstName}`, 'Mi billetera', 'Logout']
        return (
            <AppBar position="absolute">
                <Toolbar
                    sx={{
                        pr: '24px',
                    }}
                >
                    <Link color="inherit" underline="none" sx={{ flexGrow: 1 }} href='/'>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap

                        >
                            Dashboard
                        </Typography>
                    </Link>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Open settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={auth.firstName} src={`https://i.pravatar.cc/300?u=${auth.email}`} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={handleClickUserMenu}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        );
    }

    return <></>

}

export default function Navbar() {
    return <DashboardContent />;
}