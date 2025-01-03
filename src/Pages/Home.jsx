import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import { ButtonGroup, Container, Divider, Stack } from '@mui/material';
import { useCart } from '../context/cart/CartContext';
import { BASE_URL } from '../conestans/baseUrl';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { Oval } from 'react-loader-spinner';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
function Home() {
    const [data, setData] = useState([]);
    const [cartId, setCartId] = useState([]);
    const { addItemToCart, btn, cartItems } = useCart();
    const { isAuthenticated } = useAuth();
    const nav = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/menu`); // Example API
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setData(jsonData.data); // Set fetched data to state
            } catch (err) {
                console.log(err.message); // Set error message if fetch fails
            }
        };
        fetchData();
    }, []); // Empty dependency array to run once on component mount
    console.log(data)
    const isProductInCart = (productId) => {
        return cartItems.some((item) => item.productId === productId);
    };
    const handelQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            return;
        }
        setBtn(true)
        updateItemInCart(productId, quantity);
    }
    return (
        <>
            <Header />
        <Container sx={{ mt: 2 }}>
                <Typography component='h2' variant='h4' sx={{ fontWeight: 'bold', color: '#eb8225', padding: '15px  0' }}>
                    Our Menu
                </Typography>
                <Divider sx={{ margin: '0 0 20px 0' }} />
                <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2, flexWrap: 'wrap', padding: '15px 0', justifyContent: 'center' }}>
                    {data.length > 0 ?
                        data.map((proj, index) => {
                            console.log(proj)
                        return (
                            <Card key={index} sx={{ width: 345 }}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={proj.image}
                                        alt="green iguana"
                                    />
                                    <CardContent sx={{ display: 'flex', flexDirection: 'column', }}>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {proj.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                                            {proj.price} EGY
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    {isProductInCart(proj._id) ?
                                        <ButtonGroup variant="contained" aria-label="Basic button group">
                                            <Button onClick={() => handelQuantity(item.productId, item.quantity + 1)}>{btn ? "Loading" : < AddIcon />}</Button>
                                            <Button disabled sx={{ color: 'black !important' }}>{proj.quantity}</Button>
                                            <Button disabled={proj.quantity <= 1} onClick={() => handelQuantity(proj.productId, proj.quantity - 1)}>{btn ? "Loading" : <RemoveIcon />}</Button>
                                        </ButtonGroup>
                                        :
                                    <Button
                                            disabled={btn === proj._id}
                                        onClick={() => {
                                            console.log(proj._id)
                                            if (isAuthenticated) {
                                                addItemToCart(proj._id)
                                            } else {
                                                nav('/login')
                                            }
                                        }} variant='contained' >
                                            {btn === proj._id ? 'loading' : "Add To Cart"}
                                    </Button>
                                    }
                                </CardActions>
                            </Card>
                        )
                    })
                        :
                        <Stack sx={{ justifyContent: 'center', width: '100%', alignItems: 'center' }}>
                            <Oval
                                visible={true}
                                height="80"
                                width="80"
                                color="#4fa94d"
                                ariaLabel="oval-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        </Stack>
                }
            </Stack>
        </Container >
        </>
    )
}

export default Home