const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    cinema: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cinema",
        // required: true

    },
    show: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "show",
        required: true

    },
    seatType: {
        type: String,
        enum: ["silver", "gold", "platinum"],
        required: true
    },
    seats: {
        type: [String],
        required: true,
        min: 1
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    paymentId: {
        type: String
    },
    orderId: {
        type: String
    },
    paymentStatus: {
        type: String,
        default: "pending"
    },
    bookingDate: {
        type: Date,
        default: Date.now
    }

}, { timestamps: true }
)

const bookingModel = mongoose.model("Booking", ticketSchema);

module.exports = bookingModel;