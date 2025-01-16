import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { Box, Button, Card, CardActions, CardContent, CardMedia, Divider, Paper, Stack, Typography } from '@mui/material';
import Swal from "sweetalert2";
import { io } from 'socket.io-client';
import { BASE_URL } from '../conestans/baseUrl';
import moment from 'moment';
function Orders() {
    const { token, setNewOrdersCount } = useAuth();
    const [data, setData] = useState([]);
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const [btn, setBtn] = useState(false)
    const handelstatus = async (id) => {
        setBtn(true);
        try {
            const res = await fetch(`${BASE_URL}/user/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: 'accepted'
                })
            });
            // const result = await res.json();
            // if (newStatus === "accepted") {
            //     // إزالة الطلب من الواجهة إذا تم حذفه
            //     setFilterData((prevData) => prevData.filter((order) => order._id !== id));
            // } else {
            //     // تحديث الطلب في الواجهة
            //     setFilterData((prevData) =>
            //         prevData.map((order) =>
            //             order._id === id ? { ...order, status: newStatus } : order
            //         )
            //     );
            // }
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Order Accepted",
                showConfirmButton: false,
                timer: 1000
            });
            setBtn(false)
        } catch (err) {
            console.log(err);
            setBtn(false)
        }
    }
    // دالة لتشغيل الصوت
    const playSound = () => {
        const audio = new Audio("/music.mp3");
        audio.play();
    };
    // عند أول تفاعل مع الصفحة، نقوم بتفعيل القدرة على تشغيل الصوت
    useEffect(() => {
        const handleUserInteraction = () => {
            setIsSoundEnabled(true); // تفعيل الصوت
            window.removeEventListener('click', handleUserInteraction); // إزالة المستمع بعد أول تفاعل
            window.removeEventListener('keydown', handleUserInteraction);
        };

        window.addEventListener('click', handleUserInteraction);
        window.addEventListener('keydown', handleUserInteraction);

        return () => {
            window.removeEventListener('click', handleUserInteraction);
            window.removeEventListener('keydown', handleUserInteraction);
        };
    }, []);
    useEffect(() => {
        setNewOrdersCount(0); // إعادة تصفير العداد عند فتح صفحة الطلبات
    }, [setNewOrdersCount]);
    useEffect(() => {
        // الاتصال بـ Socket.IO
        const socket = io(`${BASE_URL}`, {
            transports: ["websocket", "polling"], // دعم النقل عبر Polling وWebSocket
            withCredentials: true,
        });
        // جلب الطلبات عند تحميل المكون
        const fetchOrders = async () => {
            try {
                const response = await fetch(`${BASE_URL}/user/new-orders`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch orders");
                }
                const data = await response.json();
                setData(data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchOrders();
        // استقبال الطلبات الجديدة عبر Socket.IO
        socket.on("newOrder", (newOrder) => {
            const newOne = { ...newOrder, isNew: true }
            setData((prevOrders) => [newOne, ...prevOrders]);
            // تشغيل الصوت فقط إذا كان تم التفاعل مع الصفحة
            if (isSoundEnabled) {
                playSound();
            }
        });
        // إزالة الطلب عند تحديث حالته
        socket.on("orderStatusUpdated", ({ id }) => {
            setData((prevOrders) => prevOrders.filter((order) => order._id !== id));
        });
        // تنظيف الاتصال عند انتهاء المكون
        return () => {
            socket.disconnect();
        };
    }, [isSoundEnabled]);
    // console.log(data)
    return (
        <Stack sx={{ padding: '15px 0' }}>
            <Typography>
                Orders
            </Typography>
            <Stack sx={{ gap: 2, width: '100%', padding: '10px 0' }}>
                {data.map((order, index) => {
                    return (
                        <Paper key={index} elevation={3} sx={{ padding: '30px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '25px', flexDirection: 'column', gap: 2, position: 'relative' }}>
                            <Typography className={order.isNew && "newOrder"} sx={{ position: 'absolute', backgroundColor: 'red', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bod', padding: '10px', left: '-10px', top: '-10px' }}>{order.status}</Typography>
                            <Stack divider={<Divider sx={{ margin: '10px 0' }} />} sx={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
                            {order.orderItems.map((item) => {
                                return (
                                    <Paper key={item._id} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: '100%', justifyContent: 'space-between', marginBottom: '10px' }} >
                                        <Stack sx={{ justifyContent: 'space-between', padding: '15px ', alignItems: 'start' }}>
                                        <Typography>Product Name : {item.productTitle}</Typography>
                                        <Typography>Quantity : {item.quantity}</Typography>
                                        <Typography>Price : {item.unitPrice}EGP</Typography>
                                        </Stack>
                                        <Box sx={{ width: { xs: '100%', sm: '200px' } }}>
                                            <img style={{ width: '100%', height: '100%' }} src={item.productImage} alt='' />
                                        </Box>
                                    </Paper>
                                )
                            })}
                            </Stack>
                            <Typography>Phone Num: {order.phone}</Typography>
                            <Typography>address: {order.address}</Typography>
                            <Typography>Total: {order.total}</Typography>
                            <Typography>time: {moment(order.createdAt).fromNow()}</Typography>
                            <Button 
                                disabled={btn}
                                variant='contained' onClick={() => handelstatus(order._id)}>
                                Accept
                            </Button>
                        </Paper>
                    )
                })}
            </Stack>
        </Stack>
    )
}

export default Orders
