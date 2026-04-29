import api from "../services/Authservice";
import { useContext, useEffect, useState, createContext, useRef } from "react";
import { toast } from "react-toastify";

const Authcontext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setuser] = useState(null);
    const [loading, setloading] = useState(true);
    const isJustLoggedIn = useRef(false);

    // ✅ FETCH USER
    const fetchUser = async () => {
        try {
            const res = await api.get("/auth/userdetail");
            setuser(res.data.data);

        } catch (error) {

            
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

    const setUserWithTracking = (userData) => {
        setuser(userData);
        isJustLoggedIn.current = true;
        
        setTimeout(() => {
            isJustLoggedIn.current = false;
        }, 500);
    };

    const handleLogout = async () => {
        try {
            await api.post("/auth/logout");

            toast.success("Logged out successfully!");
            setuser(null);
            isJustLoggedIn.current = false; // Reset flag on logout

        } catch (error) {
            console.error("Logout Error:", error);
        }
    };

    return (
        <Authcontext.Provider
            value={{ 
                user, 
                setuser: setUserWithTracking, 
                loading, 
                handleLogout, 
                fetchUser,
                isJustLoggedIn 
            }}
        >
            {children}
        </Authcontext.Provider>
    );
};

export const useAuth = () => useContext(Authcontext);