import React from 'react';
import { useAuth } from '../context/Authcontext';
import Loader from '../components/Loader';
import { Navigate, Outlet } from 'react-router-dom';

const Adminroutes = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.Role !== "Admin") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default Adminroutes;