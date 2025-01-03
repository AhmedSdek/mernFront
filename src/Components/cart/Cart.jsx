import { Box, Button, ButtonGroup, Container, Divider, Paper, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/cart/CartContext';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
function Cart() {
    const { isAuthenticated } = useAuth()
    const nav = useNavigate()
    useEffect(() => {
        if (!isAuthenticated) {
            nav('/')
        }
    }, []);
    const { cartItems, totalAmount, clearCart, handelQuantity, handelRemoveItem, btn } = useCart()

    // console.log(cartItems)

    if (isAuthenticated) {
        return (
            <Box sx={{ marginTop: '64px' }}>
                <Container>
                    <Typography sx={{ fontWeight: 'bold', padding: '15px 0' }}>
                        Your Cart
                    </Typography>
                    <Divider />
                    <Stack sx={{ gap: 2, padding: '10px 0' }}>
                        <Button sx={{ width: 'fit-content' }} onClick={() => clearCart()} variant='contained' color='error'>
                            Clear Cart
                        </Button>
                        <Stack sx={{ gap: 2 }}>
                            {cartItems.length ?
                                cartItems.map((item, index) => {
                                    console.log(item)
                                    return (
                                        <Paper key={index} elevation={3} sx={{ padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '25px', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                                            <Stack sx={{ flexDirection: { xs: "column", sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'initial' } }}>
                                                <Box sx={{ width: { xs: '100%', sm: '200px' } }}>
                                                    <img src={item.image} alt='' style={{ width: '100%' }} />
                                                </Box>
                                                <Stack sx={{ alignItems: 'start', gap: 1, width: { xs: '100%', sm: 'initial' } }}>
                                                    <Typography sx={{ fontWeight: 'bold' }}>{item.title}</Typography>
                                                    <Typography sx={{ fontWeight: 'bold' }}>{item.quantity} x {item.unitPrice} EGP</Typography>
                                                    <Button variant='outlined' onClick={() => handelRemoveItem(item.productId)} color='error' >{btn === item.productId ? 'loading' : 'Remove Item'}</Button>
                                                </Stack>
                                            </Stack>
                                            <ButtonGroup variant="contained" aria-label="Basic button group">
                                                <Button onClick={() => handelQuantity(item.productId, item.quantity + 1)}>{btn === item.productId ? "Loading" : < AddIcon />}</Button>

                                                <Button disabled sx={{ color: 'black !important' }}>{item.quantity}</Button>

                                                <Button disabled={item.quantity <= 1} onClick={() => handelQuantity(item.productId, item.quantity - 1)}>{btn === item.productId ? "Loading" : <RemoveIcon />}</Button>
                                            </ButtonGroup>
                                        </Paper>
                                    )
                                })
                                :
                                <Stack>
                                    <Typography>
                                        Cart is Emty
                                    </Typography>
                                </Stack>
                            }
                            <Paper elevation={3} sx={{ padding: '10px', display: 'flex', justifyContent: 'space-evenly', alignItems: 'center' }}>
                                <Typography>Total Price : {totalAmount.toFixed(2)} EGP</Typography>
                                <Button variant='contained' onClick={() => nav('/checkout')}>
                                    Check Out
                                </Button>
                            </Paper>
                        </Stack>
                    </Stack>
                </Container>
            </Box>
        )
    }
}

export default Cart