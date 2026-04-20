import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import Loader from "../components/Loader";
import axios from "axios";
import '../styles/index.css'
import { getUserBookings } from "../services/Bookingservice";

const Userdetail = () => {
    const { user, loading, handleLogout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [bookings, setBookings] = useState([]);
    const [bookingsLoading, setBookingsLoading] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            navigate("/login", {
                state: { message: "Please login first" }
            });
        }
    }, [user, loading, navigate]);

    // Bookings auto refresh
    useEffect(() => {
        const fetchUserBookings = async () => {
            if (!user) {
                setBookingsLoading(false);
                return;
            }

            try {
                const data = await getUserBookings();
                setBookings(data || []);
            } catch (error) {
                console.error("Booking fetch error:", error);
                setBookings([]);
            } finally {
                setBookingsLoading(false);
            }
        };

        fetchUserBookings();

        // Refresh when user comes back to tab
        window.addEventListener("focus", fetchUserBookings);

        return () => {
            window.removeEventListener("focus", fetchUserBookings);
        };

    }, [user, location]);

    const logoutUser = async () => {
        await handleLogout();
        navigate("/login");
    };

    // Admin panel redirect handler
    const goToAdminPanel = () => {
        navigate("/admin");
    };

    if (loading || bookingsLoading) {
        return (
            <div className="min-h-screen bg-black pt-20 sm:pt-24">
                <Loader />
            </div>
        );
    }

    const totalSpent = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
    const upcomingBookings = bookings.filter(
        booking => new Date(booking.showTime) > new Date()
    ).length;
    const memberSince = bookings.length > 0
        ? new Date(Math.min(...bookings.map(b => new Date(b.createdAt || Date.now()))))
        : new Date();

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Decorative Film Strip */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>

            {/* Background Movie Icons */}
            <div className="absolute top-24 left-4 sm:left-10 text-4xl sm:text-6xl opacity-5">🎬</div>
            <div className="absolute bottom-20 right-4 sm:right-10 text-4xl sm:text-6xl opacity-5">🎥</div>
            <div className="absolute top-40 right-20 text-3xl sm:text-4xl opacity-5 rotate-12">🍿</div>

            {/* Main Container */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
                {/* Profile Header */}
                <div className="text-center mb-6 sm:mb-8 pt-16 sm:pt-20 md:pt-24">
                    
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mt-4 sm:mt-6">
                        <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                            My Profile
                        </span>
                    </h1>
                    <div className="flex justify-center items-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                        <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-transparent to-red-600"></div>
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                        <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-l from-transparent to-red-600"></div>
                    </div>
                </div>

                {/* Profile Card */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gray-900 rounded-2xl sm:rounded-3xl 
                        border border-gray-800 shadow-2xl overflow-hidden
                        transform transition-all duration-500
                        hover:shadow-2xl hover:shadow-red-900/20">

                        {/* Profile Header with Cover Image */}
                        <div className="relative h-24 sm:h-28 md:h-32 bg-gradient-to-r from-red-900/30 to-red-800/10 border-b border-gray-800">
                            {/* Decorative Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 w-16 sm:w-20 h-16 sm:h-20 border-t-2 border-l-2 border-white/30 rounded-tl-2xl sm:rounded-tl-3xl"></div>
                                <div className="absolute top-0 right-0 w-16 sm:w-20 h-16 sm:h-20 border-t-2 border-r-2 border-white/30 rounded-tr-2xl sm:rounded-tr-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-16 sm:w-20 h-16 sm:h-20 border-b-2 border-l-2 border-white/30 rounded-bl-2xl sm:rounded-bl-3xl"></div>
                                <div className="absolute bottom-0 right-0 w-16 sm:w-20 h-16 sm:h-20 border-b-2 border-r-2 border-white/30 rounded-br-2xl sm:rounded-br-3xl"></div>
                            </div>
                        </div>

                        {/* Avatar - Positioned to overlap cover */}
                        <div className="relative px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
                            <div className="flex justify-center -mt-12 sm:-mt-14 md:-mt-16 mb-4 sm:mb-6">
                                <div className="relative group">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full 
                                        bg-gradient-to-r from-red-600 to-red-700 p-1">
                                        <div className="w-full h-full rounded-full 
                                            bg-black flex items-center justify-center
                                            border-4 border-gray-800">
                                            <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                                                {user?.Name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    <div className="absolute bottom-2 right-2 w-3 h-3 sm:w-4 sm:h-4 
                                        bg-green-500 rounded-full border-2 border-black"></div>
                                </div>
                            </div>

                            {/* User Name and Role */}
                            <div className="text-center mb-6 sm:mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                                    {user?.Name}
                                </h2>
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                    <span className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold
                                        ${user?.Role === "Admin"
                                            ? "bg-purple-900/50 text-purple-400 border border-purple-800"
                                            : "bg-green-900/50 text-green-400 border border-green-800"
                                        }`}>
                                        {user?.Role?.toUpperCase()}
                                    </span>
                                    <span className="text-gray-600 text-xs sm:text-sm">•</span>
                                    <span className="text-gray-400 text-xs sm:text-sm">
                                        Member since {memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            {/* User Details Grid */}
                            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                                {/* Email Card */}
                                <div className="bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-5 
                                    border border-gray-700 hover:border-red-800 
                                    transition-all duration-300 group">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg 
                                            bg-red-900/30 
                                            flex items-center justify-center text-base sm:text-xl
                                            group-hover:scale-110 transition-transform duration-300">
                                            📧
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-400 text-xs sm:text-sm mb-1">Email Address</p>
                                            <p className="text-white font-medium text-sm sm:text-base break-all">
                                                {user?.Email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* User ID Card */}
                                <div className="bg-gray-800 rounded-lg sm:rounded-xl p-4 sm:p-5 
                                    border border-gray-700 hover:border-red-800 
                                    transition-all duration-300 group">
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg 
                                            bg-red-900/30 
                                            flex items-center justify-center text-base sm:text-xl
                                            group-hover:scale-110 transition-transform duration-300">
                                            🆔
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-400 text-xs sm:text-sm mb-1">User ID</p>
                                            <p className="text-gray-300 text-xs sm:text-sm font-mono break-all">
                                                {user?._id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Stats */}
                                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-6">
                                    <div className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 
                                        border border-gray-700 text-center
                                        hover:border-red-800 transition-all duration-300
                                        group/stat">
                                        <p className="text-xl sm:text-2xl font-bold text-white group-hover/stat:text-red-400">
                                            {bookings.length}
                                        </p>
                                        <p className="text-[10px] sm:text-xs text-gray-400">Total Bookings</p>
                                    </div>
                                    <div className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 
                                        border border-gray-700 text-center
                                        hover:border-red-800 transition-all duration-300
                                        group/stat">
                                        <p className="text-xl sm:text-2xl font-bold text-white group-hover/stat:text-red-400">
                                            {upcomingBookings}
                                        </p>
                                        <p className="text-[10px] sm:text-xs text-gray-400">Upcoming</p>
                                    </div>
                                    <div className="bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 
                                        border border-gray-700 text-center
                                        hover:border-red-800 transition-all duration-300
                                        group/stat">
                                        <p className="text-xl sm:text-2xl font-bold text-white group-hover/stat:text-red-400">
                                            ₹{totalSpent}
                                        </p>
                                        <p className="text-[10px] sm:text-xs text-gray-400">Total Spent</p>
                                    </div>
                                </div>

                                {/* Recent Bookings Preview */}
                                {bookings.length > 0 && (
                                    <div className="mt-4 sm:mt-6">
                                        <div className="flex items-center justify-between mb-2 sm:mb-3">
                                            <h3 className="text-xs sm:text-sm font-semibold text-gray-300">
                                                Recent Bookings
                                            </h3>
                                            <Link
                                                to="/bookings"
                                                className="text-xs text-red-400 hover:text-red-300 
                                                    flex items-center gap-1 transition-colors"
                                            >
                                                View All <span>→</span>
                                            </Link>
                                        </div>
                                        <div className="space-y-2">
                                            {bookings.slice(0, 2).map((booking) => (
                                                <div key={booking._id}
                                                    className="bg-gray-800 rounded-lg p-2.5 sm:p-3
                                                        border border-gray-700 text-xs sm:text-sm">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-300 font-medium">
                                                            {booking.movie?.title || "Movie"}
                                                        </span>
                                                        <span className="text-gray-400 text-[10px] sm:text-xs">
                                                            {booking.showTime}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-2.5 sm:space-y-3">
                                {user?.Role === "Admin" && (
                                    <button
                                        onClick={goToAdminPanel}
                                        className="w-full bg-purple-600 
                                            text-white py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base
                                            hover:bg-purple-700
                                            transition-all duration-300
                                            hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-900/30"
                                    >
                                        Admin Panel →
                                    </button>
                                )}

                                <button
                                    onClick={() => navigate("/bookings")}
                                    className="w-full bg-red-600 
                                        text-white py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base
                                        hover:bg-red-700
                                        transition-all duration-300
                                        hover:scale-[1.02] hover:shadow-lg hover:shadow-red-900/30"
                                >
                                    View My Bookings →
                                </button>

                                <button
                                    onClick={logoutUser}
                                    className="w-full bg-gray-800 
                                        border border-gray-700 text-gray-300 
                                        py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base
                                        hover:bg-red-900/50 hover:border-red-800 hover:text-red-400
                                        transition-all duration-300
                                        hover:scale-[1.02]"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="text-lg sm:text-xl">🚪</span>
                                        Logout
                                    </span>
                                </button>
                            </div>

                            {/* Footer Note */}
                            <p className="text-center text-[10px] sm:text-xs text-gray-600 mt-4 sm:mt-6">
                                Keep your account secure. Do not share your credentials.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Userdetail;