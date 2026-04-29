import axios from "axios";

export const api = axios.create({
    baseURL:"https://movie-ticket-booking-7sx2.onrender.com/api",
    withCredentials: true
});


export const createOrder = async (data) => {
    const res= await api.post("/payment/create-order",data);
    return res.data;
} 

export const verifyPayment = async (data) => {
    const res = await api.post("/payment/verify", data);
    return res.data;
};