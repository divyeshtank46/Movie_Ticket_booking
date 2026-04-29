
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import Loader from "../components/Loader";

const Privateroutes = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ message: "Login First" }}
            />
        );
    }

    return children;
};

export default Privateroutes;