import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { BASE_URL } from '../conestans/baseUrl';
import { useAuth } from '../context/AuthContext';
import Swal from "sweetalert2";
import { Button, Container, FormControl, InputLabel, MenuItem, Select, Stack, Typography } from '@mui/material';

function UserEdit() {
    const { userid } = useParams();
    const nav = useNavigate()
    const { token } = useAuth();
    const [role, setRole] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/user/users/${userid}`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }); // Example API
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setRole(jsonData.data.role); // Set fetched data to state
            } catch (err) {
                console.log(err.message); // Set error message if fetch fails
            }
        };
        fetchData();
    }, []); // Empty dependency array to run once on component mount
    const handleChange = (event) => {
        setRole(event.target.value);
    }
    const handelSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/user/users/${userid}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    role: role
                }),
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
            nav("/dashboard/user-edit");
        } catch (err) {
            console.error(err.message);
        }
    }
    return (
        <Stack>
            <Container>
                <Typography>
                    User Edit
                </Typography>
                <Stack>
                    <FormControl fullWidth component='form' onSubmit={(e) => handelSubmit(e)}>
                        <InputLabel id="demo-simple-select-label">Role</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={role || ''}
                            label="Role"
                            onChange={handleChange}
                        >
                            <MenuItem value='admin'>admin</MenuItem>
                            <MenuItem value='user'>user</MenuItem>
                        </Select>
                        <Button type='submit'>
                            submit
                        </Button>
                    </FormControl>
                </Stack>
            </Container>
        </Stack>
    )
}

export default UserEdit