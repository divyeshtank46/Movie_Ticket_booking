import axios from "axios";

export const api = axios.create({
    // baseURL: "http://localhost:3000/api",
    baseURL:"https://movie-ticket-booking-7sx2.onrender.com/api",
    withCredentials: true
});


export const createOrder = async (data) => {
    const res= await api.post("/payment/create-order",data);
    return res.data;
} 