
import axios from "axios"
const API_BASE = "https://movie-ticket-booking-7sx2.onrender.com/api"

// Get shows by movie ID
export const getShowsByMovieId = async (movieId) => {
    try {
        const res = await axios.get(`${API_BASE}/show/${movieId}`);
        return res.data.data; // Returns array of shows
    } catch (error) {
        console.error("Error fetching shows:", error);
        throw error;
    }
}

export const getShowById = async (showId) => {
    try {
        const res = await axios.get(`${API_BASE}/show/single/${showId}`);
        return res.data.data; 
    } catch (error) {
        console.error("Error fetching show:", error);
        throw error;
    }
}

export const fetchAllShows = async () => {
    try {
        const res = await axios.get(`${API_BASE}/show/`);
        return res.data.count;
    }
    catch (err) {
        console.err("Error fetching show:", err);
        throw err;
    }

}
export const deleteShowById = async (id) => {
    try {
        const res = await axios.delete(`${API_BASE}/show/show/${id}`, { withCredentials: true });
        return res.data;
    }
    catch(error){
        console.error(error);
        throw error;
    }
    

}