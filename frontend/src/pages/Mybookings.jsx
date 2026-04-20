import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import '../styles/index.css'
import { getUserBookings } from "../services/Bookingservice";
import { useAuth } from "../context/Authcontext";
import { Link } from "react-router-dom";

const Mybookings = () => {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        const fetchUserBookings = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                const data = await getUserBookings();
                setBookings(data || []);
            } catch (error) {
                console.error("Booking fetch error:", error);
                toast.error("Failed to load bookings");
                setBookings([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUserBookings();
    }, [user]);

    const handleCancel = async (bookingId) => {
        try {
            setCancellingId(bookingId);
            await axios.delete(`http://localhost:3000/api/bookings/${bookingId}`, {
                withCredentials: true
            });
            setBookings(prev => prev.filter(b => b._id !== bookingId));
            toast.success("Booking cancelled successfully");
            setSelectedBooking(null);
        } catch (error) {
            console.error("Cancel error:", error);
            toast.error("Failed to cancel booking");
        } finally {
            setCancellingId(null);
        }
    };

    const getShowDateTime = (show) => {
        if (!show?.showDate || !show?.showTime) return null;
        
        const timeStr = show.showTime;
        const [time, modifier] = timeStr.split(' ');
        let [hours, minutes] = time.split(':');
        
        if (modifier === 'PM' && hours !== '12') {
            hours = parseInt(hours) + 12;
        }
        if (modifier === 'AM' && hours === '12') {
            hours = 0;
        }
        
        const showDate = new Date(show.showDate);
        showDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        return showDate;
    };

    const upcomingBookings = bookings.filter(booking => {
        const show = booking.show || {};
        const showDateTime = getShowDateTime(show);
        return showDateTime && showDateTime > new Date();
    });

    const pastBookings = bookings.filter(booking => {
        const show = booking.show || {};
        const showDateTime = getShowDateTime(show);
        return !showDateTime || showDateTime < new Date();
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        return timeString || "N/A";
    };

    const fallbackImage = "https://ik.imagekit.io/c6x5kvy0f/Movie_Cinema/et00488966-edbcmknxfb-portrait.jpg?updatedAt=1773291361498";

    if (!user && !isLoading) {
        return (
            <div className="min-h-screen bg-black text-white pt-20 sm:pt-24">
                <div className="max-w-2xl mx-auto text-center px-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 sm:p-12">
                        <span className="text-6xl mb-4 block">🔒</span>
                        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
                        <p className="text-gray-400 mb-6">You need to be logged in to view your bookings.</p>
                        <Link to="/login" className="inline-block bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors">
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header with Stats */}
            <div className="relative bg-linear-to-b from-gray-900 to-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 sm:pt-28 md:pt-32">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                            <span className="bg-linear-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                                My Bookings
                            </span>
                        </h1>
                        <p className="text-gray-400 text-base sm:text-lg">
                            Your movie journey with us
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
                        <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700">
                            <p className="text-3xl font-bold text-red-500">{bookings.length}</p>
                            <p className="text-sm text-gray-400">Total Bookings</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700">
                            <p className="text-3xl font-bold text-green-500">{upcomingBookings.length}</p>
                            <p className="text-sm text-gray-400">Upcoming Shows</p>
                        </div>
                        <div className="bg-gray-800/50 rounded-xl p-4 text-center border border-gray-700">
                            <p className="text-3xl font-bold text-purple-500">
                                ₹{bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)}
                            </p>
                            <p className="text-sm text-gray-400">Total Spent</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {isLoading ? (
                    <div className="flex justify-center items-center min-h-[50vh]">
                        <Loader />
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12">
                            <span className="text-8xl mb-4 block">🎬</span>
                            <h2 className="text-2xl font-bold mb-2">No Bookings Yet</h2>
                            <p className="text-gray-400 mb-6">Start your cinema journey with us!</p>
                            <Link to="/movies" className="inline-block bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors">
                                Browse Movies
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {/* Upcoming Section */}
                        {upcomingBookings.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                                    <h2 className="text-2xl font-bold text-white">Upcoming Shows</h2>
                                    <span className="px-2 py-1 bg-green-600 text-xs rounded-full">{upcomingBookings.length}</span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {upcomingBookings.map((booking) => {
                                        const show = booking.show || {};
                                        const cinema = show.cinemaId || {};
                                        const movie = booking.movie || {};
                                        
                                        return (
                                            <div key={booking._id} 
                                                className="relative bg-gray-900 rounded-2xl overflow-hidden border border-gray-800 hover:border-green-800 transition-all duration-300 group">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-green-600/10 rounded-bl-full"></div>
                                                
                                                <div className="p-5">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <h3 className="text-xl font-bold text-green-500 mb-1">
                                                                {movie.title || "Unknown Movie"}
                                                            </h3>
                                                            <p className="text-sm text-gray-400">
                                                                {cinema?.Name || cinema?.name || "Cinema"}
                                                            </p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-2xl font-bold text-green-500">
                                                                ₹{booking.totalPrice}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {booking.seatType?.toUpperCase()} Class
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span>📅</span>
                                                            <span className="text-gray-300">
                                                                {show.showDate ? formatDate(show.showDate) : 'N/A'}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <span>⏰</span>
                                                            <span className="text-gray-300">{formatTime(show.showTime)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm col-span-2">
                                                            <span>💺</span>
                                                            <span className="text-gray-300">
                                                                Seats: {booking.seats?.join(", ")}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <button
                                                        onClick={() => handleCancel(booking._id)}
                                                        disabled={cancellingId === booking._id}
                                                        className="w-full py-2.5 bg-red-600/20 border border-red-600 text-red-400 rounded-xl font-medium hover:bg-red-600 hover:text-white transition-all duration-300 disabled:opacity-50"
                                                    >
                                                        {cancellingId === booking._id ? (
                                                            <span className="flex items-center justify-center gap-2">
                                                                <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>
                                                                Cancelling...
                                                            </span>
                                                        ) : (
                                                            "Cancel Booking"
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Past Section */}
                        {pastBookings.length > 0 && (
                            <div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-1 h-8 bg-gray-500 rounded-full"></div>
                                    <h2 className="text-2xl font-bold text-white">Past Shows</h2>
                                    <span className="px-2 py-1 bg-gray-600 text-xs rounded-full">{pastBookings.length}</span>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {pastBookings.map((booking) => {
                                        const show = booking.show || {};
                                        const cinema = show.cinemaId || {};
                                        const movie = booking.movie || {};
                                        
                                        return (
                                            <div key={booking._id} 
                                                className="bg-gray-900/50 rounded-xl p-4 border border-gray-800 opacity-75 hover:opacity-100 transition-all duration-300">
                                                <div className="flex gap-3">
                                                    <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                                                        <img
                                                            src={movie.poster || fallbackImage}
                                                            alt={movie.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = fallbackImage;
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-300 text-sm mb-1">
                                                            {movie.title || "Unknown Movie"}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 mb-2">
                                                            {cinema?.Name || cinema?.name || "Cinema"}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-400">
                                                                {show.showDate || 'N/A'}
                                                            </span>
                                                            <span className="text-xs font-medium text-gray-400">
                                                                ₹{booking.totalPrice}
                                                            </span>
                                                        </div>
                                                        <div className="mt-1">
                                                            <span className="text-xs text-gray-500">
                                                                Seats: {booking.seats?.join(", ")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Mybookings;