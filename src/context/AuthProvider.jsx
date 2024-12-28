import React, { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext';
import { BASE_URL } from '../conestans/baseUrl';
import { io } from 'socket.io-client';
const AuthProvider = ({ children }) => {
    const USERNAME_KEY = 'userName';
    const TOKEN_KEY = 'token';
    const [userName, setUserName] = useState(localStorage.getItem(USERNAME_KEY));
    const [lastName, setLastName] = useState(localStorage.getItem('lastName'));
    const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [newOrdersCount, setNewOrdersCount] = useState(0);
    const register = (userName, lastName, token, role) => {
        setUserName(userName);
        setToken(token);
        setRole(role);
        setLastName(lastName);
        localStorage.setItem(USERNAME_KEY, userName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
    }
    const logout = () => {
        localStorage.removeItem(USERNAME_KEY);
        localStorage.removeItem('lastName');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setUserName(null);
        setLastName(null);
        setRole(null);
        setToken(null)
    }
    useEffect(() => {
        // الاتصال بـ Socket.IO
        const socket = io(BASE_URL, {
            transports: ["websocket", "polling"],
            withCredentials: true,
        });

        // استقبال الطلبات الجديدة
        socket.on("newOrder", () => {
            setNewOrdersCount((prevCount) => prevCount + 1); // زيادة العداد
        });
        // تنظيف الاتصال عند انتهاء المكون
        return () => {
            socket.disconnect();
        };
    }, []);
    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ userName, lastName, token, register, role, isAuthenticated, logout, setNewOrdersCount, newOrdersCount }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider;