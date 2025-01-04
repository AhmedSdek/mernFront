import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import { BASE_URL } from '../conestans/baseUrl';
import { io } from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
const AuthProvider = ({ children }) => {
    const TOKEN_KEY = 'token';
    const [userName, setUserName] = useState('');
    const [isVerified, setIsVerified] = useState(false);
    const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    useEffect(() => {
        const userData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/user/my-user`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }); // Example API
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const { data } = await response.json();
                // console.log(data)
                setIsVerified(data.isVerified);
                setUserName(data.firstName);
                setRole(data.role)
                localStorage.setItem("role", data.role);
                // setData(jsonData.data); // Set fetched data to state
            } catch (err) {
                console.log(err.message); // Set error message if fetch fails
            }
        };
        if (token) {
            userData();
        }
    }, [token]); // Empty dependency array to run once on component mount
    useEffect(() => {
    // if (token) {
    //     // تحقق من صلاحية الـ token ودور المستخدم
    //     // const decodedToken = jwtDecode(token);
    //     // setUserName(decodedToken.firstName);
    //     // setRole(decodedToken.role)
    //     // console.log(decodedToken)
    // }
        // الاتصال بـ Socket.IO
        const socket = io(BASE_URL, {
            transports: ["websocket", "polling"],
            withCredentials: true,
        });
        // استقبال الطلبات الجديدة
        socket.on("newOrders", () => {
            setNewOrdersCount((prevCount) => prevCount + 1); // زيادة العداد
        });
        // تنظيف الاتصال عند انتهاء المكون
        return () => {
            socket.disconnect();
        };
    }, [token]);



    const register = (token) => {
    // console.log(token)
        setToken(token);
        localStorage.setItem("token", token);
    }
    const logout = () => {
        // localStorage.removeItem(USERNAME_KEY);
        // localStorage.removeItem('lastName');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUserName(null);
        // setLastName(null);
        setRole(null);
        setToken(null);
        window.location.href = '/'
    }
    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ token, role, userName, register, isAuthenticated, logout, setNewOrdersCount, newOrdersCount, isVerified }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider;