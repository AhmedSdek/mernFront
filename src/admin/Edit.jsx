import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../conestans/baseUrl';
import { Card, CardActionArea, CardActions, CardContent, CardMedia, Container, IconButton, Stack, Typography } from '@mui/material';
import { Delete, EditSharp } from '@mui/icons-material';
import Swal from "sweetalert2";

function Edit() {
    const [data, setData] = useState([]);
    const { token } = useAuth();
    const nav = useNavigate();

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

    const removeProduct = async (productId, imageId) => {
        try {
            const res = await fetch(`${BASE_URL}/api/menu/${productId}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) {
                // setErr("faild to delete product from cart");
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: " Can't Delete Item ",
                });
            }
            // حذف الصورة من Cloudinary
            await deleteImage(imageId);
            setData((prevData) => prevData.filter(item => item._id !== productId));
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Item deleted Success",
                showConfirmButton: false,
                timer: 900
            });
        } catch (err) {
            console.log(err)
        }
    }
    // دالة حذف الصورة
    const deleteImage = async (publicId) => {
        try {
            const response = await fetch(`${BASE_URL}/delete-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ publicId }),
            });

            if (response.ok) {
                console.log('Image deleted successfully');
            } else {
                console.error('Failed to delete image');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
        }
    };
    console.log(data)
    return (
        <Container>
            <Typography>
                Edit
            </Typography>
            <Stack sx={{ flexDirection: 'row', alignItems: 'center', gap: 2, flexWrap: 'wrap', padding: '15px 0' }}>
                {data &&
                    data.map((proj, index) => {
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
                                    <Link to={`/dashboard/edit/${proj._id}`}>
                                    <IconButton>
                                        <EditSharp />
                                    </IconButton>
                                    </Link>
                                    <IconButton onClick={() => {
                                        removeProduct(proj._id, proj.imageId);
                                    }}>
                                        <Delete color='error' />
                                    </IconButton>
                                </CardActions>
                            </Card>
                        )
                    })
                }
            </Stack>
        </Container>
    )
}

export default Edit