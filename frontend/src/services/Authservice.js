import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api",
    withCredentials: true
});

/* ---------------- AUTH ---------------- */

// ✅ LOGIN
export const loginUser = async (data) => {
    try {
        const res = await api.post("/auth/login", data);
        return res.data;
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        throw error; // 👈 login ma error show karvo hoy to throw karo
    }
};

// ✅ REGISTER
export const registerUser = async (data) => {
    try {
        const res = await api.post("/auth/register", data);
        return res.data;
    } catch (error) {
        console.error("Register Error:", error.response?.data || error.message);
        throw error;
    }
};



export default api;