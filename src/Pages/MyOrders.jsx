import React, { useEffect, useState } from 'react'
import { Box, Button, Container, Divider, Paper, Stack, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../conestans/baseUrl';
import Swal from 'sweetalert2';
import { io } from 'socket.io-client';


function MyOrdersPage() {
    const { token } = useAuth();
    const handelstatus = async (id) => {
        try {
            await fetch(`${BASE_URL}/user/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'canceld'
                })
            });
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Order Canceld",
                showConfirmButton: false,
                timer: 1000
            });
        } catch (err) {
            console.log(err)
        }
    }
    const [orders, setOrders] = useState([]);
    useEffect(() => {
        const socket = io(`${BASE_URL}`, {
            transports: ["websocket", "polling"], // دعم النقل عبر Polling وWebSocket
            withCredentials: true,
            query: { token },
        });

        // الاستماع لحدث تحديث حالة الطلب
        socket.on('orderStatusUpdated', (updatedOrder) => {
            setOrders((prevOrders) => {
                return prevOrders.map((order) =>
                    order._id === updatedOrder.id ? { ...order, status: updatedOrder.status } : order
                );
            });
        });

        // تنظيف الاتصال عند إلغاء تثبيت المكون
        return () => {
            socket.disconnect();
        };
    }, [token]);
    useEffect(() => {
        // getMyOrders()
        const getMyOrders = async () => {
            try {
                const res = await fetch(`${BASE_URL}/user/my-orders`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!res.ok) {
                    return;
                }
                const data = await res.json();
                // console.log(data)
                setOrders(data)
            } catch (err) {
                console.log(err)
            }
        }
        getMyOrders()
    }, []);
    return (
        <Box sx={{ marginTop: '64px', padding: '15px 0 ' }}>
        <Container>
            <Typography>
                    My Orders Page
            </Typography>
                <Divider />
                <Stack sx={{ gap: 2 }}>
                    {orders.length > 0 ?
                        
                    orders.map((item, index) => {
                return (
                    <Paper key={index} elevation={3} sx={{ padding: '30px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '25px', flexDirection: 'column', gap: 2, position: 'relative' }}>
                        <Stack divider={<Divider sx={{ margin: '10px 0' }} />} sx={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
                        {item.orderItems.map((order, index2) => {
                            return (
                                <Paper key={index2} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: '100%', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <Stack sx={{ justifyContent: 'space-between', padding: '15px ', alignItems: 'start' }}>
                                        <Typography sx={{ fontWeight: 'bold' }}>{order.productTitle}</Typography>
                                        <Typography sx={{ fontWeight: 'bold' }}>{order.quantity} x {order.unitPrice} EGP</Typography>
                                    </Stack>
                                    <Box sx={{ width: { xs: '100%', sm: '200px' } }}>
                                        <img src={order.productImage} alt='' style={{ width: '100%' }} />
                                    </Box>
                                </Paper>
                            )
                        })}
                        </Stack>
                        <Typography>
                            My Address : {item.address}
                        </Typography>
                        <Typography>
                            My Phone : {item.phone}
                        </Typography>
                        <Typography>
                            status : {item.status}
                        </Typography>
                        <Typography>
                            Total Amount : {item.total.toFixed(2)}
                        </Typography>
                        {item.status !== 'ready' & item.status !== 'canceld' &&
                            <Button onClick={() => handelstatus(item._id)} variant='contained' color='error'>
                                cancel order
                            </Button>
                        }
                    </Paper>
                )
                    })
                        :
                        <Typography>no order yet </Typography>
                    }
                    
                </Stack>
        </Container>
        </Box>
    )
}

export default MyOrdersPage
