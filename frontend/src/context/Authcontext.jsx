import api from "../services/Authservice";
import { useContext, useEffect, useState, createContext, useRef } from "react";
import { toast } from "react-toastify";

const Authcontext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setuser] = useState(null);
    const [loading, setloading] = useState(true);
    const isJustLoggedIn = useRef(false); // Add this ref

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

    // ✅ Custom setuser function to track login state
    const setUserWithTracking = (userData) => {
        setuser(userData);
        // Set flag when user is being set (login/register)
        isJustLoggedIn.current = true;
        
        // Reset flag after 500ms (enough time for navigation)
        setTimeout(() => {
            isJustLoggedIn.current = false;
        }, 500);
    };

    // ✅ LOGOUT
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
                setuser: setUserWithTracking, // Use the tracked version
                loading, 
                handleLogout, 
                fetchUser,
                isJustLoggedIn // Expose the ref if needed
            }}
        >
            {children}
        </Authcontext.Provider>
    );
};

export const useAuth = () => useContext(Authcontext);