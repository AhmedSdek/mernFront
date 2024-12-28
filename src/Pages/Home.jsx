import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import { Container, Divider, Stack } from '@mui/material';
import { useCart } from '../context/cart/CartContext';
import { BASE_URL } from '../conestans/baseUrl';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
function Home() {
    const [data, setData] = useState([]);
    const { addItemToCart, btn, setBtn } = useCart();
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
                setData(jsonData); // Set fetched data to state
            } catch (err) {
                clg(err.message); // Set error message if fetch fails
            }
        };
        fetchData();
    }, []); // Empty dependency array to run once on component mount

    return (
        <>
            <Header />
        <Container sx={{ mt: 2 }}>
                <Typography component='h2' variant='h4' sx={{ fontWeight: 'bold', color: '#eb8225', padding: '15px  0' }}>
                    Our Menu
                </Typography>
                <Divider sx={{ margin: '0 0 20px 0' }} />
                <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {data.data &&
                    data.data.map((proj, index) => {
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
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            Price : {proj.price} EGY
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button
                                        disabled={btn}
                                        onClick={() => {
                                            if (isAuthenticated) {
                                                setBtn(false)
                                                addItemToCart(proj._id)
                                            } else {
                                                nav('/login')
                                            }
                                        }} variant='contained' >
                                        {btn ? 'loading' : "Add To Cart"}
                                    </Button>
                                </CardActions>
                            </Card>
                        )
                    })
                }
            </Stack>
        </Container >
        </>
    )
}

export default Home