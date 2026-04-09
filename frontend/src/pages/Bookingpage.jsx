

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { MdEventSeat } from "react-icons/md";
import '../styles/index.css'
import { getShowById } from "../services/Showservice";
import { bookTicket } from "../services/Bookingservice";
import { handlePayment } from "../services/Razorpay";

const SeatButton = React.memo(({ seat, selected, onSeatClick, seatType, price, isBooked }) => {
    const getSeatColor = () => {
        if (isBooked) return "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50";
        if (selected) return "bg-linear-to-r from-red-500 to-purple-500 text-white border-white/50 shadow-lg shadow-red-500/30";

        switch (seatType) {
            case 'platinum':
                return "bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30";
            case 'gold':
                return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/30";
            case 'silver':
                return "bg-gray-500/20 text-gray-300 border-gray-500/30 hover:bg-gray-500/30";
            default:
                return "bg-white/5 backdrop-blur-sm text-gray-300 border-white/20 hover:bg-white/20";
        }
    };

    return (
        <MdEventSeat
            onClick={() => {
                if (isBooked) return; // ✅ disable booked seat click
                onSeatClick(seat);
            }}
            className={`w-8 h-8 text-xs rounded-lg border transition-all duration-300
                transform ${!isBooked ? "hover:scale-110" : ""} flex items-center justify-center
                ${getSeatColor()}`}
            title={`${seat} - ${seatType} - ₹${price}`}
        />
    );
});
const Bookingpage = () => {
    const { showId } = useParams(); // Now using showId instead of movie id
    const location = useLocation();
    const navigate = useNavigate();

    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [selectedSeatType, setSelectedSeatType] = useState('silver');
    // const message = toast.success("Booking Successfull ✅")
    // Get selected show data from navigation state
    const { selectedShow } = location.state || {};

    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];

    // Generate seat layout with types
    const seatLayout = useMemo(() => {
        const layout = {};
        rows.forEach(row => {
            layout[row] = [];
            for (let i = 1; i <= 12; i++) {
                // Determine seat type based on row
                let seatType = 'silver';
                if (row === 'A' || row === 'B') seatType = 'platinum';
                else if (row === 'C' || row === 'D' || row === 'E') seatType = 'gold';

                layout[row].push({
                    id: `${row}${i}`,
                    row,
                    number: i,
                    type: seatType,
                    price: show?.price?.[seatType] || 0,
                    isBooked: show?.bookedSeats?.includes(`${row}${i}`) || false
                });
            }
        });
        return layout;
    }, [show]);

    useEffect(() => {
        const fetchShowData = async () => {
            try {
                setInitialLoading(true);
                // If we have selectedShow from state, use it
                if (selectedShow) {
                    setShow(selectedShow);
                } else {
                    // Otherwise fetch by showId
                    const response = await getShowById(showId);
                    setShow(response);
                }
            } catch (error) {
                toast.error("Failed to load show data");
                navigate(-1);
            } finally {
                setInitialLoading(false);
            }
        };

        if (showId) {
            fetchShowData();
        }
    }, [showId, selectedShow, navigate]);

    const bookingSchema = Yup.object({
        seats: Yup.array().min(1, "Select at least 1 seat")
    });

    const formik = useFormik({
        initialValues: {
            seats: []
        },
        validationSchema: bookingSchema,
        onSubmit: async (values) => {
            setLoading(true);
            try {
                const totalPrice =
                    show.price[selectedSeatType] * values.seats.length;

                await handlePayment({
                    showId: show._id,
                    seatType: selectedSeatType,
                    seats: values.seats,
                    totalPrice,
                    navigate,
                });
                formik.resetForm();
                // message

            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        }
    });

    const selectedSeatsSet = useMemo(() => {
        return new Set(formik.values.seats);
    }, [formik.values.seats]);

    const handleSeat = useCallback((seat) => {
        // Check if seat is already booked
        const seatData = seatLayout[seat[0]]?.find(s => s.id === seat);
        if (seatData?.isBooked) {
            toast.error("This seat is already booked!");
            return;
        }

        // Check if seat matches selected type
        if (seatData?.type !== selectedSeatType) {
            toast.warning(`Please select ${selectedSeatType} seats only`);
            return;
        }

        const currentSeats = formik.values.seats;

        if (currentSeats.includes(seat)) {
            formik.setFieldValue(
                "seats",
                currentSeats.filter(s => s !== seat)
            );
        } else {
            if (currentSeats.length >= 8) {
                toast.warning("Maximum 8 seats allowed per booking");
                return;
            }
            formik.setFieldValue("seats", [...currentSeats, seat]);
        }
    }, [formik, selectedSeatType, seatLayout]);

    const handleSeatTypeChange = (type) => {
        setSelectedSeatType(type);
        // Clear selected seats when changing type
        formik.setFieldValue("seats", []);
    };

    // Calculate total price
    const totalPrice = useMemo(() => {
        if (!show) return 0;
        return show.price[selectedSeatType] * formik.values.seats.length;
    }, [show, selectedSeatType, formik.values.seats.length]);

    if (initialLoading) return (
        <div className="min-h-screen bg-[#0a0a0f] pt-20">
            <Loader />
        </div>
    );

    if (!show) return (
        <div className="min-h-screen bg-[#0a0a0f] pt-20">
            <div className="max-w-2xl mx-auto text-center px-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-16">
                    <span className="text-7xl mb-6 block">🎬</span>
                    <h2 className="text-3xl font-bold text-white mb-3">Show not found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 px-6 py-3 bg-linear-to-r from-red-600 to-purple-600 
                        text-white rounded-xl"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 relative overflow-hidden">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-red-600/10 via-purple-600/10 to-blue-600/10 animate-gradient-x"></div>

            {/* Decorative Film Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 via-purple-500 to-blue-500"></div>

            {/* Background Movie Icons */}
            <div className="absolute top-20 left-10 text-6xl opacity-5 animate-pulse">🎬</div>
            <div className="absolute bottom-20 right-10 text-6xl opacity-5 animate-pulse">🎥</div>

            {/* Main Container */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header with Selected Show Info */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 
                        bg-linear-to-r from-red-500 via-purple-500 to-blue-500 
                        bg-clip-text text-transparent animate-gradient">
                        Book Your Seats
                    </h1>

                    {/* Selected Show Details - Highlighted */}
                    <div className="max-w-2xl mx-auto mt-4 p-4 bg-white/5 backdrop-blur-sm 
                        rounded-xl border border-red-500/30">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-red-400">🎬</span>
                                <span className="text-white font-semibold">
                                    {show.movieId?.title || "Movie"}
                                </span>
                            </div>
                            <div className="w-1 h-4 bg-red-500/30 hidden md:block"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-purple-400">🏢</span>
                                <span className="text-white">
                                    {show.cinemaId?.Name || show.cinemaId?.name}
                                </span>
                            </div>
                            <div className="w-1 h-4 bg-red-500/30 hidden md:block"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-400">⏰</span>
                                <span className="text-white font-bold bg-linear-to-r 
                                    from-red-500 to-purple-500 bg-clip-text">
                                    {show.showTime}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Booking Card */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl 
                        border border-white/10 shadow-2xl overflow-hidden
                        transform transition-all duration-500
                        hover:shadow-2xl hover:shadow-red-500/10">

                        <div className="p-6 sm:p-8">
                            <form onSubmit={formik.handleSubmit} className="space-y-8">
                                {/* Seat Type Selection */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Select Seat Type
                                    </label>
                                    <div className="flex flex-wrap gap-3">
                                        {['silver', 'gold', 'platinum'].map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => handleSeatTypeChange(type)}
                                                className={`px-6 py-3 rounded-xl font-medium
                                                    transition-all duration-300 transform hover:scale-[1.02]
                                                    ${selectedSeatType === type
                                                        ? `bg-${type === 'platinum' ? 'blue' : type === 'gold' ? 'yellow' : 'gray'}-600 
                                                           text-white shadow-lg`
                                                        : 'bg-white/5 backdrop-blur-sm border border-white/20 text-gray-300'
                                                    }`}
                                            >
                                                {type.charAt(0).toUpperCase() + type.slice(1)} - ₹{show.price[type]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Screen Indicator */}
                                <div className="relative py-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-white/20"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <div className="px-4 py-2 bg-white/5 backdrop-blur-sm 
                                            rounded-full border border-white/20 text-sm text-gray-400">
                                            <span className="mr-2">🎬</span> SCREEN <span className="ml-2">🎬</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Seat Layout */}
                                <div className="space-y-3">
                                    {/* Seat Legend */}
                                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-500/20 border border-gray-500/30 rounded"></div>
                                            <span className="text-xs text-gray-400">Silver (₹{show.price.silver})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-yellow-500/20 border border-yellow-500/30 rounded"></div>
                                            <span className="text-xs text-gray-400">Gold (₹{show.price.gold})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-blue-500/20 border border-blue-500/30 rounded"></div>
                                            <span className="text-xs text-gray-400">Platinum (₹{show.price.platinum})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-linear-to-r from-red-500 to-purple-500 rounded"></div>
                                            <span className="text-xs text-gray-400">Selected</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-600 rounded opacity-50"></div>
                                            <span className="text-xs text-gray-400">Booked</span>
                                        </div>
                                    </div>

                                    {/* Seat Grid */}
                                    <div className="space-y-2 overflow-x-auto pb-4">
                                        {rows.map(row => (
                                            <div key={row} className="flex items-center justify-center gap-2 min-w-max">
                                                <span className="w-6 text-gray-400 font-medium">{row}</span>
                                                <div className="flex gap-1">
                                                    {seatLayout[row]?.map((seat, index) => (
                                                        <React.Fragment key={seat.id}>
                                                            {index === 6 && <div className="w-4" />}
                                                            <SeatButton
                                                                seat={seat.id}
                                                                selected={selectedSeatsSet.has(seat.id)}
                                                                onSeatClick={handleSeat}
                                                                seatType={seat.type}
                                                                price={seat.price}
                                                                isBooked={seat.isBooked}
                                                            />
                                                        </React.Fragment>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Seat Info */}
                                    <p className="text-center text-xs text-gray-500 mt-4">
                                        <span className="text-red-400">{selectedSeatType.charAt(0).toUpperCase() + selectedSeatType.slice(1)}</span> seats selected • Max 8 seats
                                    </p>
                                </div>

                                {/* Booking Summary */}
                                {formik.values.seats.length > 0 && (
                                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 
                                        border border-white/20 space-y-3">
                                        <h3 className="text-lg font-semibold text-gray-300 mb-3">
                                            Booking Summary
                                        </h3>

                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">Selected Seats:</span>
                                            <span className="text-white font-medium">
                                                {formik.values.seats.sort().join(", ")}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">Seat Type:</span>
                                            <span className={`text-${selectedSeatType === 'platinum' ? 'blue' :
                                                selectedSeatType === 'gold' ? 'yellow' : 'gray'
                                                }-400 font-medium`}>
                                                {selectedSeatType.toUpperCase()} - ₹{show.price[selectedSeatType]}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">Number of Seats:</span>
                                            <span className="text-white">{formik.values.seats.length}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-lg font-bold pt-3 
                                            border-t border-white/20">
                                            <span className="text-gray-300">Total Amount:</span>
                                            <span className="bg-linear-to-r from-red-500 to-purple-500 
                                                bg-clip-text text-transparent">
                                                ₹{totalPrice}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading || formik.values.seats.length === 0}
                                        className="flex-1 relative overflow-hidden
                                            bg-linear-to-r from-red-600 to-purple-600 
                                            text-white py-3.5 rounded-xl font-semibold text-lg
                                            hover:from-red-700 hover:to-purple-700
                                            transition-all duration-300
                                            transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30
                                            disabled:opacity-50 disabled:cursor-not-allowed
                                            group/btn"
                                    >
                                        <span className="absolute inset-0 bg-white/20 transform 
                                            -translate-x-full group-hover/btn:translate-x-0 
                                            transition-transform duration-500"></span>
                                        <span className="relative flex items-center justify-center gap-2">
                                            {loading ? (
                                                <>
                                                    <span className="w-5 h-5 border-2 border-white 
                                                        border-t-transparent rounded-full animate-spin"></span>
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    Confirm Booking • ₹{totalPrice}
                                                    <span className="text-xl group-hover/btn:translate-x-1 transition-transform">→</span>
                                                </>
                                            )}
                                        </span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="px-6 py-3.5 bg-white/5 backdrop-blur-sm 
                                            border border-white/20 text-gray-300 rounded-xl font-medium
                                            hover:bg-white/10 transition-all duration-300
                                            transform hover:scale-[1.02]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add animations */}
            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }
                .animate-gradient-x {
                    background-size: 200% auto;
                    animation: gradient-x 3s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default Bookingpage;