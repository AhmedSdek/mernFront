import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import Swal from "sweetalert2";
import { BASE_URL } from '../conestans/baseUrl';
import { io } from 'socket.io-client';
import moment from 'moment';

function AcceptedOrders() {
    const { token } = useAuth();
    const [filterData, setFilterData] = useState([]);
    const [btn, setBtn] = useState(false)
    // useEffect(() => {
    //     // الاتصال بـ Socket.IO
    //     const socket = io(`${BASE_URL}`, {
    //         transports: ["websocket", "polling"], // دعم النقل عبر Polling وWebSocket
    //         withCredentials: true,
    //     });
    //     const fetchData = async () => {
    //         try {
    //             const response = await fetch(`${BASE_URL}/user/all-orders`, {
    //                 method: 'GET',
    //                 headers: {
    //                     "Authorization": `Bearer ${token}`
    //                 }
    //             }); // Example API
    //             if (!response.ok) {
    //                 throw new Error('Network response was not ok');
    //             }
    //             const jsonData = await response.json();
    //             // setData(jsonData); // Set fetched data to state
    //             const filtered = jsonData.filter((item) => item.status === "accepted");
    //             setFilterData(filtered);
    //         } catch (err) {
    //             clg(err.message); // Set error message if fetch fails
    //         }
    //     };
    //     fetchData();

    //     // استقبال الطلبات الجديدة عبر Socket.IO
    //     socket.on("newAcceptedOrder", (newOrder) => {
    //         const newOne = { ...newOrder, isNew: true }
    //         setFilterData((prevOrders) => [newOne, ...prevOrders]);
    //     });
    //     // تنظيف الاتصال عند انتهاء المكون
    //     return () => {
    //         socket.disconnect();
    //     };
    // }, [token]);
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
                    status: 'ready'
                })
            });
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Order Ready",
                showConfirmButton: false,
                timer: 1000
            });
            setBtn(false);
        } catch (err) {
            console.log(err);
            setBtn(false)
        }
    }
    useEffect(() => {
        // الاتصال بـ Socket.IO
        const socket = io(`${BASE_URL}`, {
            transports: ["websocket", "polling"], // دعم النقل عبر Polling و WebSocket
            withCredentials: true,
        });

        // دالة لجلب البيانات الأولية
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/user/all-orders`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                const filtered = jsonData.filter((item) => item.status !== "new");
                setFilterData(filtered);
            } catch (err) {
                console.error(err.message); // عرض الخطأ إذا فشل الجلب
            }
        };

        fetchData();

        // استقبال الطلبات الجديدة عبر Socket.IO
        socket.on("newAcceptedOrder", (newOrder) => {
            const newOne = { ...newOrder, isNew: true };
            setFilterData((prevOrders) => [newOne, ...prevOrders]);
        });

        // تحديث الطلب عند تغيير الحالة
        socket.on("orderStatusUpdated", (updatedOrder) => {
            setFilterData((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === updatedOrder.id
                        ? { ...order, status: updatedOrder.status }
                        : order
                ).filter((order) => order.status !== "new") // الإبقاء على الطلبات ذات الحالة "accepted"
            );
        });

        // تنظيف الاتصال عند انتهاء المكون
        return () => {
            socket.disconnect();
        };
    }, [filterData]);

    return (
        <Stack>
            <Typography>
                Accepted  Orders
            </Typography>
            <Stack sx={{ gap: 2, width: '100%', padding: '10px 0' }}>
                {filterData.map((order, index) => {
                    return (
                        <Paper key={index} elevation={3} sx={{ padding: '30px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '25px', flexDirection: 'column', gap: 2, position: 'relative' }}>
                            <Typography sx={{ position: 'absolute', backgroundColor: 'red', borderRadius: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bod', padding: '10px', left: '-10px', top: '-10px' }}>{order.status}</Typography>
                            <Stack divider={<Divider sx={{ margin: '10px 0' }} />} sx={{ flexDirection: 'row', width: '100%', flexWrap: 'wrap' }}>
                            {order.orderItems.map((item) => {
                                return (
                                    <Paper key={item._id} sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, width: '100%', justifyContent: 'space-between', marginBottom: '10px' }}>
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
                            <Divider sx={{ width: '100%' }} />
                            <Typography sx={{ fontWeight: 'bold' }}>Client Details</Typography>
                            <Typography>time: {moment(order.createdAt).fromNow()}</Typography>
                            <Typography>phone: {order.phone}</Typography>
                            <Typography>address: {order.address}</Typography>
                            <Typography>Total: {order.total}</Typography>
                            {order.status === 'accepted' &&
                                <Button disabled ={btn}
                                    onClick={() => handelstatus(order._id)}
                                    variant='contained'>Ready</Button>
                            }
                        </Paper>
                    )
                })}
            </Stack>
        </Stack>
    )
}

export default AcceptedOrders
