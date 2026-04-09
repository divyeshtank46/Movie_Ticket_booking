import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/Authcontext";

const Publicroutes = ({ children }) => {

    const { user, loading } = useAuth(); // 👈 direct user lo
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            toast.info("Already logged in ✅", { toastId: "already-login" });
            navigate("/", { replace: true });
        }
    }, [user, loading, navigate]);

    if (loading) return null;

    return children;
};

export default Publicroutes;