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

    useEffect(() => {
        const fetchUserBookings = async () => {
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                const data = await getUserBookings();
                console.error("Bookings data:", data); // Debug log
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
        } catch (error) {
            console.error("Cancel error:", error);
            toast.error("Failed to cancel booking");
        } finally {
            setCancellingId(null);
        }
    };

    const getStatusColor = (showDateTime) => {
        const showDate = new Date(showDateTime);
        const now = new Date();
        const diffHours = (showDate - now) / (1000 * 60 * 60);

        if (diffHours < 0) return "text-gray-500";
        if (diffHours < 2) return "text-yellow-400";
        return "text-green-400";
    };

    const getStatusText = (showDateTime) => {
        const showDate = new Date(showDateTime);
        const now = new Date();
        const diffHours = (showDate - now) / (1000 * 60 * 60);

        if (diffHours < 0) return "Completed";
        if (diffHours < 2) return "Starting Soon";
        return "Upcoming";
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const fallbackImage = "https://ik.imagekit.io/c6x5kvy0f/Movie_Cinema/et00488966-edbcmknxfb-portrait.jpg?updatedAt=1773291361498";

    // Get seat type color
    const getSeatTypeColor = (type) => {
        switch(type?.toLowerCase()) {
            case 'platinum': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
            case 'gold': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
            case 'silver': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
            default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        }
    };

    // Get price for seat type
    const getPriceForSeatType = (show, seatType) => {
        if (!show?.price) return null;
        return show.price[seatType?.toLowerCase()];
    };

    // Create combined show datetime for status checking
    const getShowDateTime = (show) => {
        if (!show?.showDate || !show?.showTime) return null;
        
        // Extract time from showTime (e.g., "4:30 PM")
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

    // Redirect to login if no user
    if (!user && !isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] text-white pt-20">
                <div className="max-w-2xl mx-auto text-center px-4">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
                        <span className="text-6xl mb-4 block">🔒</span>
                        <h2 className="text-2xl font-bold mb-2">Please Login</h2>
                        <p className="text-gray-400 mb-6">You need to be logged in to view your bookings.</p>
                        <Link to="/login" className="inline-block bg-linear-to-r from-red-600 to-purple-600 text-white px-6 py-3 rounded-xl">
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 relative overflow-hidden">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-red-600/10 via-purple-600/10 to-blue-600/10 animate-gradient-x"></div>
            
            {/* Decorative Film Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 via-purple-500 to-blue-500"></div>
            
            {/* Background Icons */}
            <div className="absolute top-20 left-10 text-6xl opacity-5 animate-pulse">🎬</div>
            <div className="absolute bottom-20 right-10 text-6xl opacity-5 animate-pulse">🎥</div>

            {/* Hero Section */}
            <div className="relative z-10">
                <div className="relative bg-black/40 backdrop-blur-xl border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 
                            bg-linear-to-r from-red-500 via-purple-500 to-blue-500 
                            bg-clip-text text-transparent animate-gradient">
                            MY BOOKINGS
                        </h1>
                        <p className="text-gray-400 text-center text-lg max-w-2xl mx-auto">
                            Track and manage all your movie ticket bookings in one place.
                        </p>
                        <div className="w-24 h-1 bg-linear-to-r from-red-500 to-blue-500 mx-auto mt-6"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center min-h-100">
                        <Loader />
                    </div>
                )}

                {/* No Bookings */}
                {!isLoading && bookings.length === 0 && (
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 
                            rounded-3xl p-16">
                            <span className="text-8xl mb-6 block animate-pulse">🎫</span>
                            <h2 className="text-3xl font-bold text-white mb-3">No Bookings Found</h2>
                            <p className="text-gray-400 text-lg mb-8">
                                You haven't booked any tickets yet. Start your cinema experience today!
                            </p>
                            <Link 
                                to="/movies"
                                className="inline-block bg-linear-to-r from-red-600 to-purple-600 
                                    text-white px-8 py-4 rounded-xl font-medium text-lg
                                    hover:from-red-700 hover:to-purple-700
                                    transition-all duration-300
                                    transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30"
                            >
                                Browse Movies
                            </Link>
                        </div>
                    </div>
                )}

                {/* Booking Stats */}
                {!isLoading && bookings.length > 0 && (
                    <div className="mb-8 flex flex-wrap gap-4 justify-between items-center">
                        <div className="bg-white/5 backdrop-blur-sm px-5 py-2.5 rounded-full 
                            border border-white/10 text-base">
                            <span className="text-gray-400">Total Bookings: </span>
                            <span className="text-white font-semibold">{bookings.length}</span>
                        </div>
                        
                        <div className="flex gap-3">
                            <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full 
                                border border-white/10 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                <span className="text-gray-400">Upcoming</span>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full 
                                border border-white/10 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                <span className="text-gray-400">Soon</span>
                            </div>
                            <div className="bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full 
                                border border-white/10 text-sm flex items-center gap-2">
                                <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                                <span className="text-gray-400">Past</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Booking Cards Grid */}
                {!isLoading && bookings.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {bookings.map((booking) => {
                            // Extract data from nested structure
                            const show = booking.show || {};
                            const cinema = show.cinemaId || {};
                            const movie = booking.movie || {};
                            const showDateTime = getShowDateTime(show);
                            
                            // Get price for selected seat type
                            const pricePerSeat = getPriceForSeatType(show, booking.seatType);
                            
                            return (
                                <div key={booking._id} className="flex flex-col h-full">
                                    {/* Card - Image Section */}
                                    <div className="group bg-linear-to-b from-gray-900 to-black 
                                        rounded-2xl overflow-hidden shadow-2xl 
                                        hover:shadow-2xl hover:shadow-red-500/20 
                                        transform hover:-translate-y-2 transition-all duration-500
                                        border border-white/10 hover:border-red-500/50">
                                        
                                        <div className="relative w-full h-96 overflow-hidden bg-gray-800">
                                            <img
                                                src={movie.poster || fallbackImage}
                                                alt={movie.title || "Movie Poster"}
                                                className="w-full h-full object-cover 
                                                    group-hover:scale-110 transition-transform duration-700"
                                                onError={(e) => {
                                                    e.target.src = fallbackImage;
                                                }}
                                            />
                                            
                                            <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent 
                                                opacity-60 group-hover:opacity-80 transition-opacity duration-500">
                                            </div>
                                            
                                            {showDateTime && (
                                                <div className={`absolute top-3 right-3 
                                                    bg-black/80 backdrop-blur-sm 
                                                    ${getStatusColor(showDateTime)} 
                                                    px-3 py-1.5 rounded-full text-xs font-semibold
                                                    border border-white/20 z-10`}>
                                                    {getStatusText(showDateTime)}
                                                </div>
                                            )}
                                            
                                            <div className="absolute bottom-3 left-3 
                                                bg-black/60 backdrop-blur-sm 
                                                text-gray-300 text-xs px-2 py-1 rounded
                                                border border-white/10 z-10">
                                                #{booking._id?.slice(-8) || "N/A"}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Details - Outside Card */}
                                    <div className="mt-4 space-y-3 flex-1 flex flex-col">
                                        {/* Movie Title */}
                                        <h2 className="text-xl font-bold line-clamp-1
                                            bg-linear-to-r from-red-500 to-purple-500 
                                            bg-clip-text text-transparent">
                                            {movie.title || "Unknown Movie"}
                                        </h2>

                                        {/* Cinema Info */}
                                        <div className="flex items-start gap-2 text-sm">
                                            <span className="text-red-500 mt-1">🏢</span>
                                            <div>
                                                <p className="text-white line-clamp-1">
                                                    {cinema?.Name || cinema?.name || "Cinema"}
                                                </p>
                                                <p className="text-gray-400 text-xs">
                                                    {cinema?.City || cinema?.city || "City"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Show Date & Time */}
                                        <div className="flex items-start gap-2 text-sm">
                                            <span className="text-red-500 mt-1">📅</span>
                                            <div>
                                                <p className="text-gray-400 text-xs">Show Date & Time</p>
                                                <p className="text-white text-sm font-medium">
                                                    {show.showDate ? formatDate(show.showDate) : 'N/A'} • {show.showTime || 'N/A'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Seat Type */}
                                        <div className="flex items-start gap-2 text-sm">
                                            <span className="text-red-500 mt-1">💺</span>
                                            <div>
                                                <p className="text-gray-400 text-xs">Seat Type</p>
                                                <span className={`inline-block text-xs px-2 py-1 rounded border ${getSeatTypeColor(booking.seatType)}`}>
                                                    {booking.seatType?.toUpperCase() || 'N/A'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Seats */}
                                        <div className="flex items-start gap-2 text-sm">
                                            <span className="text-red-500 mt-1">🎫</span>
                                            <div>
                                                <p className="text-gray-400 text-xs">Seats ({booking.seats?.length || 0})</p>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {booking.seats?.map((seat, idx) => (
                                                        <span key={idx} 
                                                            className="text-xs bg-red-500/20 text-red-400 
                                                            px-2 py-0.5 rounded border border-red-500/30">
                                                            {seat}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Price per Seat */}
                                        {pricePerSeat && (
                                            <div className="flex items-start gap-2 text-sm">
                                                <span className="text-red-500 mt-1">💰</span>
                                                <div>
                                                    <p className="text-gray-400 text-xs">Price per Seat</p>
                                                    <p className="text-white">₹{pricePerSeat}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Total Price */}
                                        <div className="flex items-start gap-2 text-sm">
                                            <span className="text-red-500 mt-1">💵</span>
                                            <div>
                                                <p className="text-gray-400 text-xs">Total Price</p>
                                                <p className="text-2xl font-bold bg-linear-to-r 
                                                    from-red-500 to-purple-500 bg-clip-text text-transparent">
                                                    ₹{booking.totalPrice || 0}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Booking Date */}
                                        {booking.createdAt && (
                                            <div className="flex items-start gap-2 text-sm">
                                                <span className="text-red-500 mt-1">📌</span>
                                                <div>
                                                    <p className="text-gray-400 text-xs">Booked On</p>
                                                    <p className="text-gray-400 text-xs">
                                                        {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Cancel Button */}
                                        {showDateTime && showDateTime > new Date() ? (
                                            <button 
                                                onClick={() => handleCancel(booking._id)}
                                                disabled={cancellingId === booking._id}
                                                className="w-full relative overflow-hidden
                                                    bg-red-600/20 border border-red-500/50
                                                    text-red-400 py-3 rounded-xl font-medium
                                                    hover:bg-red-600 hover:text-white
                                                    transition-all duration-300
                                                    transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30
                                                    disabled:opacity-50 disabled:cursor-not-allowed
                                                    group/btn mt-4"
                                            >
                                                {cancellingId === booking._id ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <span className="w-4 h-4 border-2 border-red-400 
                                                            border-t-transparent rounded-full animate-spin"></span>
                                                        Cancelling...
                                                    </span>
                                                ) : (
                                                    <>
                                                        <span className="absolute inset-0 bg-white/20 transform 
                                                            -translate-x-full group-hover/btn:translate-x-0 
                                                            transition-transform duration-500"></span>
                                                        <span className="relative">Cancel Booking</span>
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <div className="w-full bg-gray-800/50 text-gray-500 
                                                py-3 rounded-xl text-center text-sm border border-gray-700 mt-4">
                                                Show Completed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Animations */}
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

export default Mybookings;