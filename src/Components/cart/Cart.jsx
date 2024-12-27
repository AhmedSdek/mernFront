import { Box, Button, ButtonGroup, Container, Paper, Stack, Typography } from '@mui/material'
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
    const { cartItems, totalAmount, updateItemInCart, setBtn, btn, removeItemfromCart, clearCart } = useCart()
    const handelQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            return;
        }
        setBtn(true)
        updateItemInCart(productId, quantity);
    }
    const handelRemoveItem = (productId) => {
        removeItemfromCart(productId)
    }
    if (isAuthenticated) {
        return (
            <Box>
                <Container>
                    <Stack sx={{ gap: 2 }}>
                        <Button onClick={() => clearCart()} variant='text' color='error'>
                            Clear Cart
                        </Button>
                        <Stack sx={{ gap: 2 }}>
                            {cartItems.length ?
                                cartItems.map((item, index) => {
                                    return (
                                        <Paper key={index} elevation={3} sx={{ padding: '5px' }}>
                                            <img src={item.image} alt='' />
                                            <Typography>{item.title}</Typography>
                                            <Typography>{item.quantity} x {item.unitPrice} EGP</Typography>
                                            <ButtonGroup variant="contained" aria-label="Basic button group">
                                                <Button onClick={() => handelQuantity(item.productId, item.quantity + 1)}>{btn ? "Loading" : < AddIcon />}</Button>
                                                <Button disabled sx={{ color: 'black !important' }}>{item.quantity}</Button>
                                                <Button disabled={item.quantity <= 1} onClick={() => handelQuantity(item.productId, item.quantity - 1)}>{btn ? "Loading" : <RemoveIcon />}</Button>
                                                <Button onClick={() => handelRemoveItem(item.productId)} color='error' sx={{ marginLeft: '4px' }}>Remove Item</Button>
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
                            <Paper elevation={3} sx={{ padding: '5px' }}>
                                <Typography>{totalAmount.toFixed(2)} EGP</Typography>
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