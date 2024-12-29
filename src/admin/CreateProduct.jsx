import { Button, Stack, TextField, Typography } from '@mui/material'
import React, { useRef, useState } from 'react'
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext.js";
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../conestans/baseUrl.jsx';
function CreateProduct() {
    const { token } = useAuth();
    const titleRef = useRef(null);
    const nav = useNavigate()
    const priceRef = useRef(null);
    const [image, setImage] = useState(null);
    // تتبع حالة التحميل
    const [isLoading, setIsLoading] = useState(false);
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };
    // const handelSubmit = async (e) => {
    //     e.preventDefault();
    //     const title = titleRef.current.value;
    //     const image = imageRef.current.value;
    //     const price = priceRef.current.value;
    //     try {
    //         const res = await fetch(`${BASE_URL}/api/menu/creatmenu`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify({
    //                 title,
    //                 image,
    //                 price,
    //                 trending: false
    //             }),
    //         });
    //         if (!res.ok) {
    //             setErr("faild to clear products from cart");
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Oops...",
    //                 text: " Can't add the product ",
    //             });
    //         }
    //         Swal.fire({
    //             position: "top-end",
    //             icon: "success",
    //             title: "Your Pruduct added success",
    //             showConfirmButton: false,
    //             timer: 1000
    //         });
    //         nav('/')
    //     } catch (err) {
    //         console.log(err)
    //     }
    // }
    const handelSubmit = async (e) => {
        e.preventDefault();
        const title = titleRef.current.value;
        const price = priceRef.current.value;

        try {
            setIsLoading(true); // تفعيل اللودينج
            // رفع الصورة إلى Cloudinary
            const formData = new FormData();
            formData.append("file", image);
            formData.append("upload_preset", "restorant"); // استبدل بـ upload preset الخاص بـ Cloudinary
            formData.append("cloud_name", "dsy9h8z8d"); // استبدل بـ Cloud Name الخاص بك

            const cloudinaryRes = await fetch(
                `https://api.cloudinary.com/v1_1/dsy9h8z8d/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!cloudinaryRes.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: " Failed to upload image to Cloudinary ",
                });
                setIsLoading(false); // إيقاف اللودينج
                return;
            }

            const cloudinaryData = await cloudinaryRes.json();
            const imageUrl = cloudinaryData.secure_url; // رابط الصورة

            // إرسال البيانات مع رابط الصورة إلى الـ API الخاص بك
            const res = await fetch(`${BASE_URL}/api/menu/creatmenu`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    image: imageUrl, // إرسال رابط الصورة
                    price,
                    trending: false,
                }),
            });

            if (!res.ok) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: " Can't add the product ",
                });
                setIsLoading(false); // إيقاف اللودينج
                return;
            }

            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your Product added successfully",
                showConfirmButton: false,
                timer: 1000,
            });
            nav("/");
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "An error occurred while adding the product",
            });
        } finally {
            setIsLoading(false); // إيقاف اللودينج في النهاية
        }
    };
    return (
        <Stack component='form' sx={{ gap: 2, padding: '15px 0' }}
            onSubmit={(e) => handelSubmit(e)}>
            <Typography>Add Product</Typography>
            <TextField inputRef={titleRef} fullWidth label="title" id="fullWidth" />
            {/* <TextField inputRef={imageRef} fullWidth label="image" id="fullWidth" /> */}
            <TextField accept="image/*" required onChange={handleFileChange} type='file' fullWidth id="fullWidth" />
            <TextField inputRef={priceRef} type='number' fullWidth label="price" id="fullWidth" />
            <Button disabled={isLoading} type='submit' variant='contained'>
                {isLoading ? "Loading..." : "Submit"}
            </Button>
        </Stack>
    )
}

export default CreateProduct