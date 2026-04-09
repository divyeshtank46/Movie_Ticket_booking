import { bookTicket } from "./Bookingservice";
import { createOrder } from "./CreateOrder";

export const handlePayment = async ({
    showId,
    seatType,
    seats,
    totalPrice,
    navigate
}) => {

    const data = await createOrder({
        amount: totalPrice
    });
    const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: "INR",
        order_id: data.order.id,

        handler: async (res) => {
            await bookTicket({
                showId,
                seatType,
                seats,
                totalPrice,
                paymentId: res.razorpay_payment_id,
                orderId: res.razorpay_order_id,
                paymentStatus: "success"
            });

            navigate("/bookings");
        }
    };

    const razor = new window.Razorpay(options);
    razor.open();
};