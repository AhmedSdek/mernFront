import React, { useState } from 'react'
import { AuthContext } from './AuthContext';
import { BASE_URL } from '../conestans/baseUrl';
const AuthProvider = ({ children }) => {
    const USERNAME_KEY = 'userName';
    const TOKEN_KEY = 'token';
    const [userName, setUserName] = useState(localStorage.getItem(USERNAME_KEY));
    const [lastName, setLastName] = useState(localStorage.getItem('lastName'));
    const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
    const [role, setRole] = useState(localStorage.getItem('role'));
    const [orders, setOrders] = useState([]);
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
    const getMyOrders = async () => {
        try {
            const res = await fetch(`${BASE_URL}/user/my-orders`, {
                method: 'GET',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) {
                // seterr('email or password wrong please try another')
                return;
            }
            const data = await res.json();
            console.log(data)
            setOrders([...data])
        } catch (err) {
            console.log(err)
        }
    }
    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ userName, lastName, token, register, role, isAuthenticated, logout, getMyOrders, orders }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthProvider;