/* eslint-disable no-unused-vars */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import { Box, Button, Card, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../conestans/baseUrl";

function Login() {
    const [email, setEmail] = useState('');
    const [btn, setBtn] = useState(false);
    const [password, setPassword] = useState('');
    const [err, setErr] = useState('');
    const nav = useNavigate()
    const [hiden, setHiden] = useState('hiden');
    const [messeg, setMesseg] = useState(false);
    const { register, isAuthenticated } = useAuth()
    useEffect(() => {
        if (isAuthenticated) {
            nav('/')
        }
    }, []);
    if (!isAuthenticated) {
        return (
            <>
                <Box style={{ width: '100%', display: 'flex', height: 'calc(100vh - 64px)', justifyContent: 'center', alignItems: 'center' }}>
                    <Card sx={{ width: { xs: '90%', sm: '80%' }, display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
                        <Box component='form'
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const res = await fetch(`${BASE_URL}/user/login`, {
                                    method: 'POST',
                                    headers: {
                                        "Content-Type": 'application/json'
                                    },
                                    body: JSON.stringify({
                                        email,
                                        password,
                                    })
                                });
                                if (!res.ok) {
                                    setErr('Unable to login please check your email or password');
                                    return;
                                }
                                const token = await res.json();
                                if (!token) {
                                    setErr('Incorrect token')
                                }
                                console.log(token)
                                register(token.firstName, token.lastName, token.token, token.role);
                                nav('/')
                            }}
                            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                            <Typography variant="h5" component='h4'>Log In</Typography>
                            <TextField
                                sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                }}
                                id="user" label="Email" variant="outlined" type="text" />
                            <TextField
                                sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                }}
                                id="password" label="Password" variant="outlined" type="password" />
                            {
                                err &&
                                <p>{err}</p>
                            }
                            <Button type="submit" variant="contained" style={{ width: '50%' }} className="btn">
                                {btn ? '' : "login"}
                            </Button>
                            <Button onClick={() => {
                                setHiden('show')
                            }} style={{ margin: '10px', color: 'red', cursor: 'pointer' }}>
                                Forget Pass
                            </Button>
                            <p style={{ margin: '10px' }}>

                                Dont have an Acount <Link to='/register' >
                                    <Button>
                                        Register
                                    </Button>
                                </Link>
                            </p>
                        </Box>
                    </Card>
                </Box>
            </>
        )
    }

}

export default Login