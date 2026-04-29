
import axios from "axios";

const API_BASE = "https://movie-ticket-booking-7sx2.onrender.com/api";

export const api = axios.create({
    baseURL: "https://movie-ticket-booking-7sx2.onrender.com/api",
    withCredentials: true,
});

export const createMovie = async (values) => {
    const res = await axios.post("https://movie-ticket-booking-7sx2.onrender.com/api/movie/add", values,
        { withCredentials: true });
    return res.data;
}
// ✅ Fetch all movies
export const getMovies = async () => {
    const res = await axios.get(`${API_BASE}/movie/movies`);
    return res.data.movies;
};

/* ---------------- MOVIES ---------------- */

// Get all movies
export const getMovie = async () => {
    const res = await api.get("/movie");
    return res.data;
};

// Get movie by ID
export const getMovieById = async (id) => {
    const res = await api.get(`/movie/movie/${id}`);
    return res.data;
};

// Search Movie
export const searchMovie = async (name) => {
    const res = await api.get(`/movie/search?name=${name}`);
    return res.data.data;

}
// Delete Movie
export const deleteMovieById = async (id) => {
    const res = await api.delete(`/movie/movies/${id}`);
    return res.data
}
// Update Movie
export const editMovieById = async (id, values) => {
    const res = await api.patch(`/movie/movies/${id}`, values);
    return res.data;
}