
import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
    // baseURL: "http://localhost:3000/api",
    baseURL: "https://movie-ticket-booking-7sx2.onrender.com",
    withCredentials: true
});

const API_BASE = "http://localhost:3000/api";

export const addCinema = async (formData) => {
    try {
        const res = await axios.post(
            "http://localhost:3000/api/cinema/addcinema",
            formData,

            {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }

        );

        return res.data;
    } catch (error) {
        console.error("Add Cinema Error:", error); // ← use console.error, not toast
        throw error; // ← just re-throw, let the component handle the toast
    }
};


export const getCinemas = async () => {
    const res = await axios.get(`${API_BASE}/cinema`);
    return res.data.cinema;
}

/* ---------------- CINEMA ---------------- */

// Get cinemas
export const getCinemass = async () => {
    const res = await api.get("/cinema");
    return res.data;
};


// -------------- delete Cinema With Cinema Id

export const deleteCinemaById = async (id) => {
    const res = await api.delete(`/cinema/${id}`);
    return res.data;
}

// api => http://localhost:3000/api/cinema/cinema/69cd223c6f00179e6c8a2074

export const getCinemaById = async (id) => {
    const res = await api.get(`/cinema/cinema/${id}`);
    return res.data;
}

export const editCinemaById = async (id, values) => {
    const res = await api.patch(`/cinema/${id}`, values);
    return res.data;
}