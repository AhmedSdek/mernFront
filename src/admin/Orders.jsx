import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { Box, Button, Stack, Typography } from '@mui/material';
import Swal from "sweetalert2";
import { io } from 'socket.io-client';
import { BASE_URL } from '../conestans/baseUrl';
function Orders() {
    const { token } = useAuth();
    const [data, setData] = useState([]);
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const handelstatus = async (id) => {
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
        } catch (err) {
            console.log(err)
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
        // الاتصال بـ Socket.IO
        const socket = io("https://backend-production-a5a7.up.railway.app/", {
            transports: ["websocket", "polling"], // دعم النقل عبر Polling وWebSocket
            withCredentials: true,
        });
        // const socket = io("http://localhost:3000");
        // جلب الطلبات عند تحميل المكون
        const fetchOrders = async () => {
            try {
                const response = await fetch(`https://backend-production-a5a7.up.railway.app/user/all-orders`, {
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
    console.log(data)
    return (
        <Stack>
            <Typography>
                Orders
            </Typography>
            <Stack sx={{ gap: 2 }}>
                {data.map((order, index) => {
                    return (
                        <Stack key={index}>
                            <Typography>{order.status}</Typography>
                            {order.orderItems.map((item) => {
                                return (
                                    <Stack key={item._id}>
                                        <img src={item.productImage} alt='' />
                                        <Typography>{item.productTitle}</Typography>
                                        <Typography>{item.quantity}</Typography>
                                        <Typography>{item.unitPrice}EGP</Typography>
                                    </Stack>
                                )
                            })}
                            <Typography>phone: {order.phone}</Typography>
                            <Typography>address: {order.address}</Typography>
                            <Typography>Total: {order.total}</Typography>
                            <Button onClick={() => handelstatus(order._id, 'accepted')}>
                                Accept
                            </Button>
                            {/* <Button onClick={() => setNoti(true)}>
                                Reject
                            </Button> */}
                        </Stack>
                    )
                })}
            </Stack>
            {/* <div>
                <audio src={m} />
            </div> */}
        </Stack>
    )
}

export default Orders