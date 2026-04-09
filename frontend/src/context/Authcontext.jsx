import api from "../services/Authservice"; // 👈 tamaru axios instance
import { useContext, useEffect, useState, createContext } from "react";
import { toast } from "react-toastify";

const Authcontext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setuser] = useState(null);
    const [loading, setloading] = useState(true);

    // ✅ FETCH USER
    const fetchUser = async () => {
        try {
            const res = await api.get("/auth/userdetail");
            setuser(res.data.data);

        } catch (error) {

            // 👇 401 silent handle
            if (error.response?.status === 401) {
                setuser(null);
            } else {
                console.error("Fetch User Error:", error);
            }

        } finally {
            setloading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    // ✅ LOGOUT
    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");

            toast.success("Logged out successfully!");
            setuser(null);

        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <Authcontext.Provider
            value={{ user, setuser, loading, handleLogout, fetchUser }}
        >
            {children}
        </Authcontext.Provider>
    );
};

export const useAuth = () => useContext(Authcontext);