const { default: mongoose } = require("mongoose");

const showSchema = new mongoose.Schema({
    movieId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true
    },
    cinemaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cinema",
        required: true
    },
    showDate: {
        type: Date,
        required: true
    },
    showTime: {
        type: String,
        required: true
    },
    price: {
        silver: Number,
        gold: Number,
        platinum: Number,
    },
    totalSeats: {
        type: Number,
        default: 120
    },
    bookedSeats: {
        type: [String],
        default: []
    }
}, { timestamps: true })
showSchema.index(
    { movieId: 1, cinemaId: 1, showDate: 1, showTime: 1 },
    { unique: true }
);
const showModel = mongoose.model("show", showSchema);

module.exports = showModel;
