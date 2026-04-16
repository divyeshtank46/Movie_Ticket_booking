import axios from "axios";

const API_BASE = "https://movie-ticket-booking-7sx2.onrender.com/api";

export const getAllUsers = async () => {
    try {
        const res = await axios.get(`${API_BASE}/auth/allusers`,
            { withCredentials: true });
        return res.data.data;
    } catch (err) {
        console.error("Failed TO Get Users", err.message);
        throw err;
    }
}
export const SwitchRole = async (id) => {
    const res = await axios.patch(
        `${API_BASE}/auth/switchrole/${id}`,
        {}, 
        {
            withCredentials: true  
        }
    );
    return res.data;
}