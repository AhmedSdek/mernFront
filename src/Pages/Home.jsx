import React, { useEffect, useState } from 'react'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import { Container, Stack } from '@mui/material';
import { useCart } from '../context/cart/CartContext';
import { BASE_URL } from '../conestans/baseUrl';
function Home() {
    const [data, setData] = useState([]);
    const { addItemToCart, btn, setBtn } = useCart()
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
        <Container sx={{ mt: 2 }}>
            <Stack sx={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {data.data &&
                    data.data.map((proj, index) => {
                        return (
                            <Card key={index} sx={{ minWidth: 345 }}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={proj.image}
                                        alt="green iguana"
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div">
                                            {proj.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                            {proj.price}EGY
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                <CardActions>
                                    <Button
                                        disabled={btn}
                                        onClick={() => {
                                            setBtn(false)
                                            addItemToCart(proj._id)
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
    )
}

export default Home