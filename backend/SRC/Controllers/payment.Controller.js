const crypto = require("crypto");
const razorpay = require("../Config/razorpay");
const { bookTicket } = require("./booking.Controller");
const bookingModel = require("../Models/Booking.model");

const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || Number(amount) <= 0) {
            return res.status(400).json({
                success: false,
                message: "Valid amount is required"
            });
        }

        const options = {
            amount: Math.round(Number(amount) * 100),
            currency: "INR"
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Order Creation Failed ${error.message}`
        });
    }
};

const verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingData
        } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Missing Razorpay payment fields"
            });
        }

        if (!bookingData || typeof bookingData !== "object") {
            return res.status(400).json({
                success: false,
                message: "bookingData is required"
            });
        }

        if (!process.env.RAZORPAY_KEY_SECRET) {
            return res.status(500).json({
                success: false,
                message: "Razorpay secret is not configured"
            });
        }

        const signatureBody = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET.trim())
            .update(signatureBody)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }

        const existingBooking = await bookingModel.findOne({
            paymentId: razorpay_payment_id
        });

        if (existingBooking) {
            return res.status(200).json({
                success: true,
                message: "Payment already verified",
                booking: existingBooking
            });
        }

        req.body = {
            ...bookingData,
            paymentId: razorpay_payment_id,
            orderId: razorpay_order_id,
            paymentStatus: "success"
        };

        return bookTicket(req, res);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Payment verification failed ${error.message}`
        });
    }
};

module.exports = { createOrder, verifyPayment };
