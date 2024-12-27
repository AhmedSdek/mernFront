import React, { useEffect } from 'react'
import { Container, Stack, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';


function MyOrdersPage() {
    const { getMyOrders, orders } = useAuth();
    console.log(orders)
    useEffect(() => {
        getMyOrders()
    }, []);
    return (
        <Container>
            <Typography>
                MyOrdersPage
            </Typography>
            {orders.map((item, index) => {
                return (
                    <Stack key={index}>
                        {item.orderItems.map((order, index2) => {
                            return (
                                <Stack sx={{ justifyContent: 'space-evenly', alignItems: 'center', flexDirection: 'row' }} key={index2}>
                                    <img src={order.productImage} alt="" width={150} />
                                    <Typography>
                                        {order.productTitle}
                                    </Typography>
                                    <Typography>
                                        {order.quantity} x {order.unitPrice} EGP
                                    </Typography>
                                </Stack>
                            )
                        })}
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
                    </Stack>
                )
            })}
        </Container>
    )
}

export default MyOrdersPage