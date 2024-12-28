import React from 'react'
import Badge from '@mui/material/Badge';
import { useAuth } from '../../context/AuthContext';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Stack } from '@mui/material';
import { useCart } from '../../context/cart/CartContext';
function Nav() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const { userName, role, isAuthenticated, logout } = useAuth()
    const nav = useNavigate()
    const { cartItems } = useCart()
    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };


    const handelLogout = () => {
        logout();
        nav('/');
        handleCloseUserMenu()
    }
    const handelcartbtn = () => {
        nav('/cart')
    }
    const habdelDashboard = () => {
        nav('/dashboard')
        handleCloseUserMenu();
    }
    const handelOrders = () => {
        handleCloseUserMenu();
        nav('my-orders')
    }
    return (
        <AppBar position="fixed" sx={{ backgroundColor: '#ffffffa8' }}>
            <Container maxWidth="xl">
                <Toolbar sx={{ justifyContent: 'space-between' }} disableGutters>
                    <Link to='/'>
                        <Typography
                            variant="h6"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 'bold',
                                letterSpacing: '.3rem',
                                color: '#eb8225'
                            }}
                        >
                            LOGO
                        </Typography>
                    </Link>
                    <Link to='/'>
                        <Typography
                            variant="h5"
                            noWrap
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: "bold",
                                letterSpacing: '.3rem',
                                color: '#eb8225',
                            }}
                        >
                            LOGO
                        </Typography>
                    </Link>
                    {isAuthenticated ?
                        <Box sx={{ flexGrow: 0 }}>
                            <Stack sx={{ flexDirection: 'row', gap: 2, alignItems: 'center' }} title="Open settings">
                                <IconButton onClick={handelcartbtn} sx={{
                                    backgroundColor: '#bdbdbd',
                                    '&:hover': {
                                        color: 'white',
                                        backgroundColor: '#eb8225',
                                    },
                                }} >
                                    <Badge badgeContent={cartItems.length} color="error" sx={{
                                        top: "-17px",
                                        left: "27px"
                                    }} />
                                    <ShoppingCartIcon sx={{ color: 'black' }} />
                                </IconButton>
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={userName} sx={{ color: 'black' }} src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Stack>
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

                                <MenuItem onClick={() => handelOrders()}>
                                    <Typography sx={{ textAlign: 'center' }}>My Orders</Typography>
                                </MenuItem>
                                <MenuItem onClick={handelLogout}>
                                    <Typography sx={{ textAlign: 'center' }}>Logout</Typography>
                                </MenuItem>
                                {role === 'admin' &&
                                    <MenuItem onClick={habdelDashboard}>
                                        <Typography sx={{ textAlign: 'center' }}>Dashboard</Typography>
                                    </MenuItem>
                                }
                            </Menu>
                        </Box>
                        :
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt={userName} src="/static/images/avatar/2.jpg" />
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

                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Link to='/login' sx={{ textAlign: 'center' }}>login</Link>
                                </MenuItem>
                                <MenuItem onClick={handleCloseUserMenu}>
                                    <Link to='/register' sx={{ textAlign: 'center' }}>Register</Link>
                                </MenuItem>
                            </Menu>
                        </Box>
                    }
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default Nav