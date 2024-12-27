import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { Box, Button, Stack, Typography } from '@mui/material';
import Swal from "sweetalert2";
import { BASE_URL } from '../conestans/baseUrl';
function AcceptedOrders() {
    const { token } = useAuth();
    const [filterData, setFilterData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/user/all-orders`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }); // Example API
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                // setData(jsonData); // Set fetched data to state
                const filtered = jsonData.filter((item) => item.status === "accepted");
                setFilterData(filtered);
            } catch (err) {
                clg(err.message); // Set error message if fetch fails
            }
        };
        fetchData();
    }, [token]);


    return (
        <Stack>
            <Typography>
                Accepted  Orders
            </Typography>
            <Stack sx={{ gap: 2 }}>
                {filterData.map((order, index) => {
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
                        </Stack>
                    )
                })}
            </Stack>
        </Stack>
    )
}

export default AcceptedOrders