import { Box, Button, ButtonGroup, Container, Paper, Stack, TextField, Typography } from '@mui/material'
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
            <Box>
                <Container>
                    <Typography>
                        Check Out Page
                    </Typography>
                    <Stack sx={{ gap: 2 }}>
                        <Stack sx={{ gap: 2 }}>
                            {
                                cartItems.map((item, index) => {
                                    return (
                                        <Paper key={index} elevation={3} sx={{ padding: '5px' }}>
                                            <img src={item.image} alt='' />
                                            <Typography>{item.title}</Typography>
                                            <Typography>{item.quantity} x {item.unitPrice} EGP</Typography>
                                        </Paper>
                                    )
                                })
                            }
                            <Paper elevation={3} sx={{ padding: '10px' }}>
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
                                <Typography sx={{ margin: '10px 0 ' }}>{`Total Price : ${totalAmount.toFixed(2)}`} EGP</Typography>
                                <Button onClick={(e) => handelConfirm(e)} variant='contained'>
                                    Confirm Order
                                </Button>
                            </Paper>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        )
    }
}

export default CheckOut