// services/Razorpay.js
import { bookTicket } from "./Bookingservice";
import { createOrder } from "./CreateOrder";
import { loadRazorpay } from "../utils/loadRazorpay";
export const handlePayment = async ({
    showId,
    seatType,
    seats,
    seatDetails,
    totalPrice,
    navigate,
    user
}) => {

    const res = await loadRazorpay();
    if (!res) {
        alert("Razorpay SDK failed to load");
        return;
    }
    // Return a promise that resolves when payment is complete
    return new Promise(async (resolve, reject) => {
        try {
            const data = await createOrder({
                amount: totalPrice
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                order_id: data.order.id,
                name: user?.Name || user?.name || "CINEBOOK", // Show user's name instead of CINEBOOK
                description: `Booking ${seats.length} ${seatType} seats`,
                prefill: {
                    name: user?.Name || user?.name || "",
                    email: user?.Email || user?.email || "",
                    contact: user?.Mobile || user?.mobile || user?.phone || ""
                },
                theme: {
                    color: "#e8000c" // Red theme to match your app
                },
                modal: {
                    ondismiss: () => {
                        reject(new Error("Payment cancelled by user"));
                    }
                },
                handler: async (res) => {
                    try {
                        // Book the tickets
                        const bookingResult = await bookTicket({
                            showId,
                            seatType,
                            seats,
                            seatDetails,
                            totalPrice,
                            paymentId: res.razorpay_payment_id,
                            orderId: res.razorpay_order_id,
                            paymentStatus: "success"
                        });

                        // Navigate to bookings page
                        navigate("/bookings");

                        resolve({
                            success: true,
                            bookingId: bookingResult._id || bookingResult.id,
                            seats: seats,
                            totalPrice: totalPrice
                        });
                    } catch (error) {
                        reject(new Error(error.message || "Booking failed after payment"));
                    }
                }
            };
            const razor = new window.Razorpay(options);
            razor.open();

            console.log("FULL OPTIONS:", options)
        } catch (error) {
            reject(new Error(error.message || "Failed to initiate payment"));
        }
    });
};


// services/Razorpay.js
// import { bookTicket } from "./Bookingservice";
// import { createOrder } from "./CreateOrder";

// export const handlePayment = async ({
//     showId,
//     seatType,
//     seats,
//     totalPrice,
//     navigate,
//     user
// }) => {
//     try {
//         const data = await createOrder({
//             amount: totalPrice
//         });

//         const options = {
//             key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//             amount: data.order.amount,
//             currency: "INR",
//             order_id: data.order.id,

//             name: user?.Name || user?.name || "CINEBOOK",

//             description: `Booking ${seats.length} ${seatType} seats`,

//             prefill: {
//                 name: user?.Name || user?.name || "",
//                 email: user?.Email || user?.email || "",
//                 contact: user?.Mobile || user?.mobile || user?.phone || ""
//             },

//             theme: {
//                 color: "#EF4444"
//             },

//             handler: async (res) => {
//                 try {
//                     const bookingResult = await bookTicket({
//                         showId,
//                         seatType,
//                         seats,
//                         totalPrice,
//                         paymentId: res.razorpay_payment_id,
//                         orderId: res.razorpay_order_id,
//                         paymentStatus: "success"
//                     });

//                     navigate("/bookings");

//                 } catch (error) {
//                     console.error(error);
//                 }
//             }
//         };

//         const razor = new window.Razorpay(options);
//         razor.open();

//     } catch (error) {
//         throw new Error(error.message || "Payment failed");
//     }
// };