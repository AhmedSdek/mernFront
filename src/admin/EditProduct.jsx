import React, { useEffect, useRef, useState } from 'react'
import { BASE_URL } from '../conestans/baseUrl';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from "sweetalert2";
import { Button, Stack, TextField, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function EditProduct() {
    const { id } = useParams();
    const { token } = useAuth();
    const [originalData, setOriginalData] = useState({}); // البيانات الأصلية
    const [data, setData] = useState({}); // البيانات الحالية
    const nav = useNavigate();
    const [image, setImage] = useState(null);
    // تتبع حالة التحميل
    const [isLoading, setIsLoading] = useState(false);
    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/menu/${id}`); // Example API
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setOriginalData(jsonData.data); // حفظ البيانات الأصلية
                setData(jsonData.data); // Set fetched data to state
            } catch (err) {
                console.log(err.message); // Set error message if fetch fails
            }
        };
        fetchData();
    }, []); // Empty dependency array to run once on component mount
    // console.log(data)
    // console.log(id)
    // const handelSubmit = async (e, id) => {
    //     e.preventDefault();
    //     const title = titleRef.current.value;
    //     const price = priceRef.current.value;
    //     try {

    //         setIsLoading(true); // تفعيل اللودينج
    //         // رفع الصورة إلى Cloudinary
    //         const formData = new FormData();
    //         formData.append("file", image);
    //         formData.append("upload_preset", "restorant"); // استبدل بـ upload preset الخاص بـ Cloudinary
    //         formData.append("cloud_name", "dsy9h8z8d"); // استبدل بـ Cloud Name الخاص بك
    //         const cloudinaryRes = await fetch(
    //             `https://api.cloudinary.com/v1_1/dsy9h8z8d/image/upload`,
    //             {
    //                 method: "POST",
    //                 body: formData,
    //             }
    //         );
    //         if (!cloudinaryRes.ok) {
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Oops...",
    //                 text: " Failed to upload image to Cloudinary ",
    //             });
    //             setIsLoading(false); // إيقاف اللودينج
    //             return;
    //         }
    //         const cloudinaryData = await cloudinaryRes.json();
    //         const imageUrl = cloudinaryData.secure_url; // رابط الصورة
    //         const imagePublicId = cloudinaryData.public_id; // Public ID الخاص بالصورة
    //         // إرسال البيانات مع رابط الصورة إلى الـ API الخاص بك
    //         const res = await fetch(`${BASE_URL}/api/menu/creatmenu/${id}`, {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             body: JSON.stringify({
    //                 title,
    //                 image: imageUrl, // إرسال رابط الصورة
    //                 imageId: imagePublicId,
    //                 price,
    //                 trending: false,
    //             }),
    //         });
    //         if (!res.ok) {
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Oops...",
    //                 text: " Can't edit the product ",
    //             });
    //             setIsLoading(false); // إيقاف اللودينج
    //             return;
    //         }
    //         Swal.fire({
    //             position: "top-end",
    //             icon: "success",
    //             title: "Your Product edit successfully",
    //             showConfirmButton: false,
    //             timer: 1000,
    //         });
    //         // nav("/");
    //     } catch (err) {
    //         console.error(err);
    //         Swal.fire({
    //             icon: "error",
    //             title: "Oops...",
    //             text: "An error occurred while editing the product",
    //         });
    //     } finally {
    //         setIsLoading(false); // إيقاف اللودينج في النهاية
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // مقارنة الحقول المعدلة
            const updatedFields = {};

            if (data.title !== originalData.title) {
                updatedFields.title = data.title;
            }
            if (data.price !== originalData.price) {
                updatedFields.price = data.price;
            }
            if (image) {
                //حذف الصوره القديمه
                const response = await fetch(`${BASE_URL}/delete-image`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ publicId: originalData.imageId }),
                });

                if (response.ok) {
                    console.log('Image deleted successfully');
                } else {
                    console.error('Failed to delete image');
                }
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
                const imagePublicId = cloudinaryData.public_id; // Public ID الخاص بالصورة

                updatedFields.image = imageUrl;
                updatedFields.imageId = imagePublicId
            }
            // إذا لم يتغير شيء، لا ترسل طلب
            if (Object.keys(updatedFields).length === 0) {
                console.log('No changes made');
                setIsLoading(false);
                return;
            }

            const response = await fetch(`${BASE_URL}/api/menu/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedFields),
            });

            if (!response.ok) throw new Error('Failed to update product');
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Your Product edit successfully",
                showConfirmButton: false,
                timer: 1000,
            });
            // console.log('Product updated successfully!');
            nav("/");
        } catch (err) {
            console.error(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // console.log(data)
    // console.log(originalData)
    return (
        <Stack component='form' sx={{ gap: 2, padding: '15px 0' }}
            onSubmit={(e) => handleSubmit(e)}>
            <Typography>Edit Product</Typography>
            <TextField
                fullWidth
                value={data.title || ''}
                onChange={(e) => setData({ ...data, title: e.target.value })} // تحديث الحالة
                label="Title"
                id="fullWidth"
            />
            <TextField
                accept="image/*"
                onChange={handleFileChange}
                type="file"
                // value={data.image}
                fullWidth
                id="fullWidth"
            />
            <TextField
                type="number"
                fullWidth
                value={data.price || ''}
                onChange={(e) => setData({ ...data, price: e.target.value })}
                label="Price"
                id="fullWidth"
            />
            <Button disabled={isLoading} type='submit' variant='contained'>
                {isLoading ? "Loading..." : "Submit"}
            </Button>
        </Stack>
    )
}

export default EditProduct