
import axios from "axios";

export const api = axios.create({
        baseURL:"https://movie-ticket-booking-7sx2.onrender.app/api",
    // baseURL: "http://localhost:3000/api",
    withCredentials: true
});

/* ---------------- BOOKING ---------------- */

// Book tickets
export const bookTicket = async (data) => {
    try {
        // data should contain: { showId, seatType, seats, totalPrice }
        const res = await api.post("/ticket/book", data);
        return res.data;
    } catch (error) {
        console.error("Error booking ticket:", error);
        throw error;
    }
};

// Get user bookings
export const getUserBookings = async () => {
    try {
        const response = await axios.get(
            " https://movie-ticket-booking-7sx2.onrender.com/api/ticket/bookings",
            {
                withCredentials: true, // 🔥 important if using cookies
            }
        );
        return response.data.data;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
    }
};

// Get Monthly Revenue

export const getRevenue = async () => {
    try {
        const res = await api.get("/ticket/admin/revenue", {
            withCredentials: true
        })
        console.error(res.data.revenue)
        return res.data.revenue;
    }
    catch (err) {
        console.error("error", err);
        throw err
    }

}
// localhost:3000/api/ticket/69cca13cdca24681bc10e31c

export const deletebooking = async (id) => {
    const res = await api.delete(`/ticket/${id}`);
    return res.data;
}
