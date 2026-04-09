import axios from "axios";

export const getAllBookings = async () => {
    try {
        const response = await axios.get(
            "http://localhost:3000/api/ticket/allbookings",
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