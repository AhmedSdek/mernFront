import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function ProtectedRoute() {
    const { token, role, isAuthenticated } = useAuth()
    if (!isAuthenticated) {
        return <Navigate to='/login' replace={true} />
    }
    if (role !== 'admin') {
        return <Navigate to='/' replace={true} />
    }
    return (
        <Outlet />
    )
}

export default ProtectedRoute