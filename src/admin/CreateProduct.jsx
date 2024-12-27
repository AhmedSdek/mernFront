import { Box, Button, Container, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, TextField, Typography } from '@mui/material'
import React, { useRef } from 'react'
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext.js";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../conestans/baseUrl.jsx';
function CreateProduct() {
    const { token } = useAuth();
    const titleRef = useRef(null);
    const imageRef = useRef(null);
    const priceRef = useRef(null);
    const nav = useNavigate()
    const handelSubmit = async (e) => {
        e.preventDefault();
        const title = titleRef.current.value;
        const image = imageRef.current.value;
        const price = priceRef.current.value;
        try {
            const res = await fetch(`${BASE_URL}/api/menu/creatmenu`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    image,
                    price,
                    trending: false
                }),
            });
            if (!res.ok) {
                setErr("faild to clear products from cart");
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: " Can't add the product ",
                });
            }
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your Pruduct added success",
                showConfirmButton: false,
                timer: 1000
            });
            nav('/')
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <Stack component='form' sx={{ gap: 2 }}
            onSubmit={(e) => handelSubmit(e)}>
            <Typography>Add Product</Typography>
            <TextField inputRef={titleRef} fullWidth label="title" id="fullWidth" />
            <TextField inputRef={imageRef} fullWidth label="image" id="fullWidth" />
            <TextField inputRef={priceRef} type='number' fullWidth label="price" id="fullWidth" />
            <Button type='submit' variant='contained'>
                Submit
            </Button>
        </Stack>
    )
}

export default CreateProduct