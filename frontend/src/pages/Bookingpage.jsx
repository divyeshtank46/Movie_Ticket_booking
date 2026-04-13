import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { MdEventSeat } from "react-icons/md";
import '../styles/index.css'
import { getShowById } from "../services/Showservice";
import { handlePayment } from "../services/Razorpay";
import { useAuth } from "../context/Authcontext";

const SeatButton = React.memo(({ seat, selected, onSeatClick, seatType, price, isBooked }) => {
    const getSeatColor = () => {
        if (isBooked) return "bg-gray-700 text-gray-500 cursor-not-allowed opacity-50";
        if (selected) return "bg-red-600 text-white border-red-700 shadow-lg shadow-red-900/30";

        switch (seatType) {
            case 'platinum':
                return "bg-blue-900/50 text-blue-300 border-blue-800 hover:bg-blue-800/50";
            case 'gold':
                return "bg-yellow-900/50 text-yellow-300 border-yellow-800 hover:bg-yellow-800/50";
            case 'silver':
                return "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700";
            default:
                return "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700";
        }
    };

    return (
        <MdEventSeat
            onClick={() => {
                if (isBooked) return;
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
    const { showId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth(); 
    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [selectedSeatType, setSelectedSeatType] = useState('silver');

    const { selectedShow } = location.state || {};

    const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];

    const seatLayout = useMemo(() => {
        const layout = {};
        rows.forEach(row => {
            layout[row] = [];
            for (let i = 1; i <= 12; i++) {
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
                if (selectedShow) {
                    setShow(selectedShow);
                } else {
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
                const totalPrice = show.price[selectedSeatType] * values.seats.length;

                // Wait for payment to complete first
                const paymentResult = await handlePayment({
                    showId: show._id,
                    seatType: selectedSeatType,
                    seats: values.seats,
                    totalPrice,
                    navigate,
                    user
                });

                // Only show success toast if payment was successful
                if (paymentResult?.success) {
                    toast.success(
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">🎉</span>
                                <span className="font-bold">Booking Successful!</span>
                            </div>
                            <div className="text-sm mt-1">
                                Seats: {values.seats.sort().join(", ")} • Amount: ₹{totalPrice}
                            </div>
                            <div className="text-xs mt-1 text-green-200">
                                Enjoy your movie! 🍿
                            </div>
                        </div>,
                        {
                            position: "top-center",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            icon: "✅"
                        }
                    );
                    
                    formik.resetForm();
                    
                    setTimeout(async () => {
                        try {
                            const updatedShow = await getShowById(showId);
                            setShow(updatedShow);
                        } catch (error) {
                            console.error("Failed to refresh seats", error);
                        }
                    }, 2000);
                }
                
            } catch (error) {
                toast.error(error.message || "Payment failed. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    });

    const selectedSeatsSet = useMemo(() => {
        return new Set(formik.values.seats);
    }, [formik.values.seats]);

    const handleSeat = useCallback((seat) => {
        const seatData = seatLayout[seat[0]]?.find(s => s.id === seat);
        if (seatData?.isBooked) {
            toast.error("This seat is already booked!");
            return;
        }

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
        formik.setFieldValue("seats", []);
    };

    const totalPrice = useMemo(() => {
        if (!show) return 0;
        return show.price[selectedSeatType] * formik.values.seats.length;
    }, [show, selectedSeatType, formik.values.seats.length]);

    if (initialLoading) return (
        <div className="min-h-screen bg-black pt-20">
            <Loader />
        </div>
    );

    if (!show) return (
        <div className="min-h-screen bg-black pt-20">
            <div className="max-w-2xl mx-auto text-center px-4">
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-16">
                    <span className="text-7xl mb-6 block">🎬</span>
                    <h2 className="text-3xl font-bold text-white mb-3">Show not found</h2>
                    <button
                        onClick={() => navigate(-1)}
                        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white pt-20 relative overflow-hidden">
            {/* Decorative Film Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

            {/* Background Movie Icons */}
            <div className="absolute top-20 left-10 text-6xl opacity-5">🎬</div>
            <div className="absolute bottom-20 right-10 text-6xl opacity-5">🎥</div>

            {/* Main Container */}
            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header with Selected Show Info */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-red-500">
                        Book Your Seats
                    </h1>

                    {/* Selected Show Details - Highlighted */}
                    <div className="max-w-2xl mx-auto mt-4 p-4 bg-gray-900 
                        rounded-xl border border-red-800">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-red-400">🎬</span>
                                <span className="text-white font-semibold">
                                    {show.movieId?.title || "Movie"}
                                </span>
                            </div>
                            <div className="w-1 h-4 bg-red-800 hidden md:block"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-purple-400">🏢</span>
                                <span className="text-white">
                                    {show.cinemaId?.Name || show.cinemaId?.name}
                                </span>
                            </div>
                            <div className="w-1 h-4 bg-red-800 hidden md:block"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-400">⏰</span>
                                <span className="text-white font-bold text-red-500">
                                    {show.showTime}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Booking Card */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-900 rounded-3xl 
                        border border-gray-800 shadow-2xl overflow-hidden
                        transform transition-all duration-500
                        hover:shadow-2xl hover:shadow-red-900/20">

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
                                                        ? type === 'platinum' ? 'bg-blue-600 text-white' 
                                                        : type === 'gold' ? 'bg-yellow-600 text-white' 
                                                        : 'bg-gray-600 text-white'
                                                        : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
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
                                        <div className="w-full border-t border-gray-800"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <div className="px-4 py-2 bg-gray-800 
                                            rounded-full border border-gray-700 text-sm text-gray-400">
                                            <span className="mr-2">🎬</span> SCREEN <span className="ml-2">🎬</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Seat Layout */}
                                <div className="space-y-3">
                                    {/* Seat Legend */}
                                    <div className="flex flex-wrap justify-center gap-4 mb-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-800 border border-gray-700 rounded"></div>
                                            <span className="text-xs text-gray-400">Silver (₹{show.price.silver})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-yellow-900/50 border border-yellow-800 rounded"></div>
                                            <span className="text-xs text-gray-400">Gold (₹{show.price.gold})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-blue-900/50 border border-blue-800 rounded"></div>
                                            <span className="text-xs text-gray-400">Platinum (₹{show.price.platinum})</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-red-600 rounded"></div>
                                            <span className="text-xs text-gray-400">Selected</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 bg-gray-700 rounded opacity-50"></div>
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
                                    <div className="bg-gray-800 rounded-xl p-6 
                                        border border-gray-700 space-y-3">
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
                                            <span className={`font-medium ${
                                                selectedSeatType === 'platinum' ? 'text-blue-400' :
                                                selectedSeatType === 'gold' ? 'text-yellow-400' : 'text-gray-400'
                                            }`}>
                                                {selectedSeatType.toUpperCase()} - ₹{show.price[selectedSeatType]}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-400">Number of Seats:</span>
                                            <span className="text-white">{formik.values.seats.length}</span>
                                        </div>

                                        <div className="flex justify-between items-center text-lg font-bold pt-3 
                                            border-t border-gray-700">
                                            <span className="text-gray-300">Total Amount:</span>
                                            <span className="text-red-500">
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
                                        className="flex-1 bg-red-600 
                                            text-white py-3.5 rounded-xl font-semibold text-lg
                                            hover:bg-red-700
                                            transition-all duration-300
                                            hover:scale-[1.02] hover:shadow-lg hover:shadow-red-900/30
                                            disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="w-5 h-5 border-2 border-white 
                                                    border-t-transparent rounded-full animate-spin inline-block mr-2"></span>
                                                Processing...
                                            </>
                                        ) : (
                                            `Confirm Booking • ₹${totalPrice} →`
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="px-6 py-3.5 bg-gray-800 
                                            border border-gray-700 text-gray-300 rounded-xl font-medium
                                            hover:bg-gray-700 transition-all duration-300
                                            hover:scale-[1.02]"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Bookingpage;