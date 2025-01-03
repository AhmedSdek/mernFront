import React, { useEffect, useState } from 'react'
import { BASE_URL } from '../conestans/baseUrl';
import { useAuth } from '../context/AuthContext';
import { ButtonGroup, Container, IconButton, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Delete, EditSharp } from '@mui/icons-material';
import Swal from "sweetalert2";
import { useNavigate } from 'react-router-dom';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

function Users() {
    const [data, setData] = useState([]);
    const { token } = useAuth();
    const nav = useNavigate()
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${BASE_URL}/user/all-users`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }); // Example API
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();
                setData(jsonData.data); // Set fetched data to state
            } catch (err) {
                console.log(err.message); // Set error message if fetch fails
            }
        };
        fetchData();
    }, []); // Empty dependency array to run once on component mount
    const handelDelet = async (id) => {
        try {
            const res = await fetch(`${BASE_URL}/user/users/${id}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (!res.ok) {
                // setErr("faild to delete product from cart");
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: " Can't Delete Item ",
                });
            }
            setData((prevData) => prevData.filter(item => item._id !== id));
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Item deleted Success",
                showConfirmButton: false,
                timer: 900
            });
        } catch (err) {
            console.log(err)
        }
    }
    return (
        <Container>
            <Stack sx={{ padding: '20px 0' }}>
                <Typography>
                    Users
                </Typography>
                <TableContainer component={Paper}>
                    <Table aria-label="customized table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Email</StyledTableCell>
                                <StyledTableCell >First Name</StyledTableCell>
                                <StyledTableCell >Last Name</StyledTableCell>
                                <StyledTableCell >Role</StyledTableCell>
                                <StyledTableCell >Creatid At</StyledTableCell>
                                <StyledTableCell align="right">Actions</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((user) => (
                                <StyledTableRow key={user._id}>
                                    <StyledTableCell component="th" scope="row">
                                        {user.email}
                                    </StyledTableCell>
                                    <StyledTableCell >{user.firstName}</StyledTableCell>
                                    <StyledTableCell >{user.lastName}</StyledTableCell>
                                    <StyledTableCell >{user.role}</StyledTableCell>
                                    <StyledTableCell >{user.createdAt}</StyledTableCell>
                                    <StyledTableCell align="right">
                                        <ButtonGroup>
                                            <IconButton onClick={() => nav(`${user._id}`)}>
                                                <EditSharp />
                                            </IconButton>
                                            <IconButton onClick={() => handelDelet(user._id)}>
                                                <Delete color='error' />
                                            </IconButton>
                                        </ButtonGroup>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
        </Container>
    );
}

export default Users