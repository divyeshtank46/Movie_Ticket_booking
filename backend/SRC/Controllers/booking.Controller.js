const bookingModel = require("../Models/Booking.model");
const CinemaModel = require("../Models/Cinema.model")
const MovieModel = require("../Models/Movie.model")
const UserModel = require("../Models/UserModel")
const { default: mongoose } = require('mongoose');
const Show = require('../Models/Show.model');

const bookTicket = async (req, res) => {
    try {
        let { showId, seatType, seats, paymentId, orderId, paymentStatus } = req.body;
        const userId = req.user._id;

        // ✅ Normalize seatType
        seatType = seatType?.toLowerCase();

        // ✅ Remove duplicate seats from request
        seats = [...new Set(seats)];

        if (!showId || !seatType || !seats?.length) {
            return res.status(400).json({
                message: "All Fields Are Required"
            });
        }

        const show = await Show.findById(showId);
        if (!show) {
            return res.status(404).json({
                message: "Show Not Found"
            });
        }

        // ✅ Check already booked seats
        const alreadyBooked = seats.filter(seat =>
            show.bookedSeats.includes(seat)
        );

        if (alreadyBooked.length > 0) {
            return res.status(400).json({
                message: "Some Seats Are Already Booked",
                bookedSeats: alreadyBooked
            });
        }

        const pricePerSeat = show.price[seatType];
        if (!pricePerSeat) {
            return res.status(400).json({
                message: "Invalid Seat Type"
            });
        }

        const totalPrice = pricePerSeat * seats.length;

        // ✅ Prevent duplicates while pushing
        show.bookedSeats = [...new Set([...show.bookedSeats, ...seats])];

        await show.save();

        const booking = await bookingModel.create({
            user: userId,
            movie: show.movieId,
            show: showId,
            seatType,
            seats,
            totalPrice,
            paymentId,
            orderId,
            paymentStatus
        });

        return res.status(201).json({
            message: "Booking Successfull",
            booking
        });

    } catch (error) {
        console.error(error); // ✅ debug
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};



const getBookings = async (req, res) => {
    try {
        const bookings = await bookingModel
            .find({ user: req.user._id })
            .populate("movie", "title poster")
            .populate({
                path: "show",
                populate: {
                    path: "cinemaId",
                    model: "Cinema", // 👈 IMPORTANT
                    select: "name title location"
                }
            })
            .sort({ createdAt: -1 });

        if (!bookings.length) {
            return res.status(404).json({
                message: "No Bookings Found"
            });
        }

        return res.status(200).json({
            message: "Booking Fetched Successfully",
            totalBookings: bookings.length,
            data: bookings
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Something Went Wrong",
            error: error.message
        });
    }
};
const getallBookings = async (req, res) => {
    try {
        const bookings = await bookingModel.find()
            .populate("movie", "title poster")
            .populate({
                path: "show",
                populate: {
                    path: "cinemaId",
                    select: "Name City"
                }
            })
            .populate("user", "Name Email Role")
            .sort({ createdAt: -1 });
        if (!bookings.length) {
            return res.status(404).json({
                message: "No Bookings Found"
            })
        }
        return res.status(200).json({
            message: "All Bookings Fetched Successfully",
            totalBookings: bookings.length,
            data: bookings
        })
    } catch (err) {
        return res.status(500).json({
            message: "Something Went Wrong",
            error: err.message
        })
    }
}

const deleteBookings = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid booking ID"
            });
        }


        const deletedBookings = await bookingModel.findOneAndDelete({
            _id: id,
            user: req.user._id   // 👈 also use _id not id
        });

        if (!deletedBookings) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        return res.status(200).json({
            message: "Booking Deleted Successfully"
        });

    } catch (err) {
        return res.status(500).json({
            message: "Failed To Delete Booking",
            error: err.message
        });
    }
}
const deleteAllBookings = async (req, res) => {
    try {
        const result = await bookingModel.deleteMany({});
        return res.status(200).json({
            success: true,
            message: "All Bookings Delted Successfully",
            deletedCount: result.deletedCount
        })
    }
    catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"

        })
    }
}

const totalRevenue = async (req, res) => {
    try {
        const revenue = await bookingModel.aggregate([
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m", date: "$createdAt" }

                    },
                    TotalRevenue: { $sum: "$totalPrice" }
                }
            },
            { $sort: { _id: 1 } }
        ]);
        return res.status(200).json({
            revenue
        })
    } catch (error) {
        res.status(500).json({
            message: "Error  fetching Revenue",
            error: error.message
        })
    }
}
module.exports = {
    bookTicket,
    getBookings,
    getallBookings,
    deleteBookings,
    deleteAllBookings,
    totalRevenue
}