import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/Authcontext";

const Publicroutes = ({ children }) => {
    const { user, loading, isJustLoggedIn } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && user) {
            const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
            
            if (isAuthPage) {
                if (!isJustLoggedIn.current) {
                    toast.info("Already logged in ✅", { 
                        toastId: "already-login",
                        autoClose: 2000
                    });
                }
                navigate("/", { replace: true });
            }
        }
    }, [user, loading, navigate, location.pathname]);

    if (loading) return null;

    return children;
};

export default Publicroutes;