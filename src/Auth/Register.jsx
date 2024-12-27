/* eslint-disable no-unused-vars */
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { Box, Button, Card, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { BASE_URL } from "../conestans/baseUrl";

function Regester() {
    const [userName, setUserName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [btn, setBtn] = useState(false);
    const [err, setErr] = useState('');
    const nav = useNavigate()
    const { register, isAuthenticated } = useAuth()
    useEffect(() => {
        if (isAuthenticated) {
            nav('/')
        }
    }, []);
    if (!isAuthenticated) {
        return (
            <Box style={{ width: '100%', display: 'flex', height: 'calc(100vh - 64px)', justifyContent: 'center', alignItems: 'center' }}>
                <Card sx={{ width: { xs: '90%', sm: '80%' }, display: 'flex', alignItems: 'center', flexDirection: 'column', padding: '20px' }}>
                    <Typography variant="h5" component='h4'>Create a new Acount</Typography>
                    <Box component='form'
                        onSubmit={async (e) => {
                            e.preventDefault();
                            const res = await fetch(`${BASE_URL}/user/register`, {
                                method: 'POST',
                                headers: {
                                    "Content-Type": 'application/json'
                                },
                                body: JSON.stringify({
                                    firstName: userName,
                                    lastName,
                                    email,
                                    password,
                                    role: "user"
                                })
                            });
                            if (!res.ok) {
                                setErr('Unable to register please check your email or password');
                                return;
                            }
                            const token = await res.json();
                            if (!token) {
                                setErr('Incorrect token')
                            }
                            setBtn(true);
                            console.log(token)
                            register(token.firstName, token.lastName, token.token, token.role);
                            nav('/')
                        }}
                        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', width: '100%' }}>
                        <TextField
                            sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                            onChange={(e) => {
                                setUserName(e.target.value);
                            }}
                            id="username" label="first Name" variant="outlined" type="text" />
                        <TextField
                            sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                            onChange={(e) => {
                                setLastName(e.target.value);
                            }}
                            id="lastname" label="last Name" variant="outlined" type="text" />
                        <TextField
                            sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            id="email" label="Email" variant="outlined" type="text" />

                        <TextField
                            sx={{ margin: '10px', padding: '5px', width: { xs: '100%', md: '50%' } }}
                            onChange={(e) => {
                                setPassword(e.target.value);

                            }}
                            id="pass" label="Password" variant="outlined" type="password" />
                        {
                            err &&
                            <p>{err}</p>
                        }
                        <Button variant="contained" type="submit" style={{ width: '50%' }}

                            className="btn">
                            {btn ? 'loading' : "signup"}
                        </Button>
                        <p style={{ margin: '10px' }}>
                            Already have an Acount <Link to='/login' >
                                <Button>
                                    login
                                </Button>
                            </Link>
                        </p>
                    </Box>
                </Card>
            </Box>
        )
    }
}

export default Regester