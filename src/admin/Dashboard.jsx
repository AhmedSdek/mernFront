import { Box, Container, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, Typography } from '@mui/material'
import React, { useRef } from 'react'
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { Outlet, useNavigate } from 'react-router-dom';
function Dashboard() {
    const nav = useNavigate()

    const actions = [
        { icon: <FileCopyIcon />, name: 'Create', path: 'create' },
        { icon: <SaveIcon />, name: 'New Orders', path: 'orders' },
        { icon: <PrintIcon />, name: 'Accepted Orders', path: 'accepted-orders' },
        { icon: <ShareIcon />, name: 'Share' },
    ];
    return (
        <Container>
            <Stack>
                <Typography>
                    Dashboard
                </Typography>
                <Outlet />
            </Stack>
            <Box sx={{ position: 'fixed', bottom: '0', right: '0' }}>
                <SpeedDial
                    ariaLabel="SpeedDial basic example"
                    sx={{ position: 'absolute', bottom: 16, right: 16 }}
                    icon={<SpeedDialIcon />}
                >
                    {actions.map((action) => (
                        <SpeedDialAction
                            key={action.name}
                            icon={action.icon}
                            tooltipTitle={action.name}
                            onClick={() => nav(`dashboard/${action.path}`)}
                        />
                    ))}
                </SpeedDial>
            </Box>
        </Container>
    )
}

export default Dashboard