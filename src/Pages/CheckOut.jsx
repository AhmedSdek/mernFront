import { Box, Button, ButtonGroup, Container, Divider, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useCart } from '../context/cart/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../conestans/baseUrl';
function CheckOut() {
    const { isAuthenticated, token } = useAuth();
    const [err, seterr] = useState(false);
    const addressRef = useRef(null);
    const phoneRef = useRef(null);
    const nav = useNavigate()
    useEffect(() => {
        if (!isAuthenticated) {
            nav('/')
        }
    }, []);
    const { cartItems, totalAmount } = useCart()
    const handelConfirm = async (e) => {
        e.preventDefault()
        const address = addressRef.current.value;
        const phone = phoneRef.current.value;
        if (!address) {
            // seterr(true);
            return;
        }
        if (!phone) {
            // seterr(true);
            return;
        }
        try {
            const res = await fetch(`${BASE_URL}/cart/checkout`, {
                method: 'POST',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    address,
                    phone
                })
            });
            if (!res.ok) {
                // seterr('email or password wrong please try another')
                return;
            }
            window.location.href = '/order-success'
        } catch (err) {
            console.log(err)
        }
    }
    if (isAuthenticated) {
        return (
            <Box sx={{ marginTop: '64px' }}>
                <Container>
                    <Typography sx={{ fontWeight: 'bold', padding: '15px 0' }}>
                        Check Out Page
                    </Typography>
                    <Divider />

                    <Stack sx={{ gap: 2, padding: '10px 0' }}>
                        <Stack sx={{ gap: 2 }}>
                            {
                                cartItems.map((item, index) => {
                                    return (
                                        <Paper key={index} elevation={3} sx={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '25px', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                            <Stack sx={{ flexDirection: { xs: "column", sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'initial' } }}>
                                                <Box sx={{ width: { xs: '100%', sm: '200px' } }}>
                                                    <img src={item.image} alt='' style={{ width: '100%' }} />
                                                </Box>
                                                <Stack sx={{ alignItems: 'start', gap: 1, width: { xs: '100%', sm: 'initial' } }}>
                                                    <Typography sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                                                    <Typography sx={{ fontWeight: 'bold' }}>{item.quantity} x {item.unitPrice} EGP</Typography>
                                                </Stack>
                                            </Stack>
                                        </Paper>
                                    )
                                })
                            }
                            <Paper elevation={3} sx={{ padding: '10px' }}>
                                <Typography>
                                    Complite the form
                                </Typography>
                                <Stack sx={{ gap: 2 }}>
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Phone Numper"
                                        inputRef={phoneRef}
                                        name='phone'
                                    />
                                    <TextField
                                        required
                                        id="outlined-required"
                                        label="Delivery Address"
                                        inputRef={addressRef}
                                        name='address'
                                    />
                                </Stack>
                                <Stack sx={{ flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', padding: '15px 0 ' }}>
                                    <Typography>Total Price : {totalAmount.toFixed(2)} EGP</Typography>
                                    <Button onClick={(e) => handelConfirm(e)} variant='contained'>
                                        Confirm Order
                                    </Button>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        )
    }
}

export default CheckOut