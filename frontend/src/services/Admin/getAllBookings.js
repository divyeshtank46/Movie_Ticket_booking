import axios from "axios";

export const getAllBookings = async () => {
    try {
        const response = await axios.get(
            "https://movie-ticket-booking-7sx2.onrender.com/api/ticket/allbookings",
            {
                withCredentials: true,
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        throw error;
    }
};