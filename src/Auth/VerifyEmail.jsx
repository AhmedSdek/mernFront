import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../conestans/baseUrl';

const VerifyEmail = () => {
    const [message, setMessage] = useState('');
    const { search } = useLocation();  // الحصول على الـ query string من الـ URL

    // استخراج الـ token من الـ URL
    const queryParams = new URLSearchParams(search);
    const token = queryParams.get('token');
    const nav = useNavigate()
    useEffect(() => {
        const verfy = async () => {
            try {
                // التأكد من أن الـ token موجود
                if (token) {
                    // إرسال الـ token إلى الـ Backend للتحقق من التفعيل
                    const res = await fetch(`${BASE_URL}/user/verify-email?token=${token}`, {
                        method: 'GET',
                    });
                    if (res.ok) {
                        setMessage('Email verified successfully!');
                        // بعد التحقق بنجاح، يمكنك توجيه المستخدم إلى صفحة أخرى
                        setTimeout(() => {
                            nav('/login');  // على سبيل المثال، توجيه المستخدم إلى صفحة تسجيل الدخول
                        }, 2000);
                    } else {
                        setMessage('Invalid or expired verification link.');
                    }
                    const json = res.json();
                    // .then((res) => res.json())
                    // .then((data) => {
                    //     console.log(data)
                    //     if () {
                    //         setMessage('Email verified successfully!');
                    //         // بعد التحقق بنجاح، يمكنك توجيه المستخدم إلى صفحة أخرى
                    //         setTimeout(() => {
                    //             Navigate('/');  // على سبيل المثال، توجيه المستخدم إلى صفحة تسجيل الدخول
                    //         }, 2000);
                    //     } else {
                    //         setMessage('Invalid or expired verification link.');
                    //     }
                    // })
                    // .catch((error) => {
                    //     console.error('Error verifying email:', error);
                    //     setMessage('Something went wrong. Please try again later.');
                    // });
                } else {
                    setMessage('Invalid verification link.');
                }
            } catch (err) {
                setMessage('Something went wrong. Please try again later.');
            }
        }
        verfy()
    }, []);

    return (
        <div>
            <h1>Verify Your Email</h1>
            <p>{message}</p>
        </div>
    );
};

export default VerifyEmail;