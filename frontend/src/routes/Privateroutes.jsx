
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import Loader from "../components/Loader";

const Privateroutes = ({ children }) => {
    const { user, loading } = useAuth();

    // ⏳ Wait until auth check completes
    if (loading) {
        return <Loader />;
    }

    // 🔐 If not logged in → redirect
    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ message: "Login irst" }}
            />
        );
    }

    // ✅ If logged in → allow access
    return children;
};

export default Privateroutes;