import { Container, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

function OrderSuccess() {
    return (
        <Stack sx={{ marginTop: '64px' }}>
            <Container>
                <Stack sx={{ height: 'calc(100vh - 64px)', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                    <Typography>
                        Order Success
                    </Typography>
                    <Link to='/' style={{ color: 'blue' }}>
                        Go To Home
                    </Link>
                </Stack>
            </Container>
        </Stack>
    )
}

export default OrderSuccess