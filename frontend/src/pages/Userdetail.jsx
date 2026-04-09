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

    // ✅ FIXED: bookings auto refresh
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

        // ✅ Refresh when user comes back to tab
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
        navigate("/admin"); // Change this to your actual admin route
    };

    if (loading || bookingsLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] pt-20">
                <Loader />
            </div>
        );
    }

    // ✅ Now calculations will auto update
    const totalSpent = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);

    const upcomingBookings = bookings.filter(
        booking => new Date(booking.showTime) > new Date()
    ).length;

    const memberSince = bookings.length > 0
        ? new Date(Math.min(...bookings.map(b => new Date(b.createdAt || Date.now()))))
        : new Date();

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 relative overflow-hidden">
            {/* 🔥 UI SAME AS YOUR ORIGINAL — NO CHANGE BELOW */}
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-red-600/10 via-purple-600/10 to-blue-600/10 animate-gradient-x"></div>

            {/* Decorative Film Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 via-purple-500 to-blue-500"></div>

            {/* Background Movie Icons */}
            <div className="absolute top-20 left-10 text-6xl opacity-5 animate-pulse">🎬</div>
            <div className="absolute bottom-20 right-10 text-6xl opacity-5 animate-pulse">🎥</div>
            <div className="absolute top-40 right-20 text-4xl opacity-5 rotate-12">🍿</div>

            {/* Main Container */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Profile Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block group mb-6">
                        <span className="text-3xl font-bold bg-linear-to-r from-red-500 via-purple-500 to-blue-500 
                            bg-clip-text text-transparent animate-gradient">
                            CINEBOOK
                        </span>
                        <span className="ml-1 text-3xl">🎬</span>
                    </Link>
                </div>

                {/* Profile Card with Glass Effect */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white/5 backdrop-blur-xl rounded-3xl 
                        border border-white/10 shadow-2xl overflow-hidden
                        transform transition-all duration-500
                        hover:shadow-2xl hover:shadow-red-500/10">

                        {/* Profile Header with Cover Image */}
                        <div className="relative h-32 bg-linear-to-r from-red-600/20 via-purple-600/20 to-blue-600/20">
                            {/* Decorative Pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-white/30 rounded-tl-3xl"></div>
                                <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-white/30 rounded-tr-3xl"></div>
                                <div className="absolute bottom-0 left-0 w-20 h-20 border-b-2 border-l-2 border-white/30 rounded-bl-3xl"></div>
                                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-white/30 rounded-br-3xl"></div>
                            </div>
                        </div>

                        {/* Avatar - Positioned to overlap cover */}
                        <div className="relative px-8 pb-8">
                            <div className="flex justify-center -mt-16 mb-6">
                                <div className="relative group">
                                    <div className="w-32 h-32 rounded-full 
                                        bg-linear-to-r from-red-500 via-purple-500 to-blue-500 
                                        p-1 animate-gradient">
                                        <div className="w-full h-full rounded-full 
                                            bg-[#0a0a0f] flex items-center justify-center
                                            border-4 border-white/20">
                                            <span className="text-4xl font-bold 
                                                bg-linear-to-r from-red-500 to-purple-500 
                                                bg-clip-text text-transparent">
                                                {user?.Name?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Status Indicator */}
                                    <div className="absolute bottom-2 right-2 w-4 h-4 
                                        bg-green-500 rounded-full border-2 border-white/30
                                        animate-pulse"></div>
                                </div>
                            </div>

                            {/* User Name and Role */}
                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold mb-2 
                                    bg-linear-to-r from-red-500 to-purple-500 
                                    bg-clip-text text-transparent">
                                    {user?.Name}
                                </h1>
                                <div className="flex items-center justify-center gap-2">
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold
                                        ${user?.Role === "Admin"
                                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                                            : "bg-green-500/20 text-green-400 border border-green-500/30"
                                        }`}>
                                        {user?.Role?.toUpperCase()}
                                    </span>
                                    <span className="text-gray-500 text-sm">•</span>
                                    <span className="text-gray-400 text-sm">
                                        Member since {memberSince.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                                    </span>
                                </div>
                            </div>

                            {/* User Details Grid */}
                            <div className="space-y-4 mb-8">
                                {/* Email Card */}
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 
                                    border border-white/10 hover:border-red-500/30 
                                    transition-all duration-300 group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg 
                                            bg-linear-to-r from-red-600/20 to-purple-600/20 
                                            flex items-center justify-center text-xl
                                            group-hover:scale-110 transition-transform duration-300">
                                            📧
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-400 text-sm mb-1">Email Address</p>
                                            <p className="text-white font-medium break-all">
                                                {user?.Email}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* User ID Card */}
                                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-5 
                                    border border-white/10 hover:border-red-500/30 
                                    transition-all duration-300 group">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg 
                                            bg-linear-to-r from-red-600/20 to-purple-600/20 
                                            flex items-center justify-center text-xl
                                            group-hover:scale-110 transition-transform duration-300">
                                            🆔
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-gray-400 text-sm mb-1">User ID</p>
                                            <p className="text-gray-300 text-sm font-mono break-all">
                                                {user?._id}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Account Stats */}
                                <div className="grid grid-cols-3 gap-4 mt-6">
                                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 
                                        border border-white/10 text-center
                                        hover:border-red-500/30 transition-all duration-300
                                        group/stat">
                                        <p className="text-2xl font-bold text-white group-hover/stat:text-red-400">
                                            {bookings.length}
                                        </p>
                                        <p className="text-xs text-gray-400">Total Bookings</p>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 
                                        border border-white/10 text-center
                                        hover:border-red-500/30 transition-all duration-300
                                        group/stat">
                                        <p className="text-2xl font-bold text-white group-hover/stat:text-red-400">
                                            {upcomingBookings}
                                        </p>
                                        <p className="text-xs text-gray-400">Upcoming</p>
                                    </div>
                                    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 
                                        border border-white/10 text-center
                                        hover:border-red-500/30 transition-all duration-300
                                        group/stat">
                                        <p className="text-2xl font-bold text-white group-hover/stat:text-red-400">
                                            ₹{totalSpent}
                                        </p>
                                        <p className="text-xs text-gray-400">Total Spent</p>
                                    </div>
                                </div>

                                {/* Recent Bookings Preview */}
                                {bookings.length > 0 && (
                                    <div className="mt-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-semibold text-gray-300">
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
                                                    className="bg-white/5 backdrop-blur-sm rounded-lg p-3
                                                        border border-white/10 text-sm">
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-300">
                                                            {booking.movie?.title || "Movie"}
                                                        </span>
                                                        <span className="text-gray-400 text-xs">
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

                            <div className="space-y-3">
                                {
                                    user.Role === "Admin" && (
                                        <button
                                            onClick={goToAdminPanel}
                                            className="w-full relative overflow-hidden
                                        bg-linear-to-r from-purple-600 to-blue-600 
                                        text-white py-3.5 rounded-xl font-semibold
                                        hover:from-purple-700 hover:to-blue-700
                                        transition-all duration-300
                                        transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/30
                                        group/btn"
                                        >

                                            <span className="absolute inset-0 bg-white/20 transform 
                                        -translate-x-full group-hover/btn:translate-x-0 
                                        transition-transform duration-500"></span>
                                            <span className="relative flex items-center justify-center gap-2">
                                                Admin Panel
                                                <span className="text-xl group-hover/btn:translate-x-1 transition-transform">→</span>
                                            </span>
                                        </button>

                                    )
                                }
                                {/* Admin Panel Button - STATIC (Shows for all users) */}

                                <button
                                    onClick={() => navigate("/bookings")}
                                    className="w-full relative overflow-hidden
                                        bg-linear-to-r from-red-600 to-purple-600 
                                        text-white py-3.5 rounded-xl font-semibold
                                        hover:from-red-700 hover:to-purple-700
                                        transition-all duration-300
                                        transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30
                                        group/btn"
                                >
                                    <span className="absolute inset-0 bg-white/20 transform 
                                        -translate-x-full group-hover/btn:translate-x-0 
                                        transition-transform duration-500"></span>
                                    <span className="relative flex items-center justify-center gap-2">
                                        View My Bookings
                                        <span className="text-xl group-hover/btn:translate-x-1 transition-transform">→</span>
                                    </span>
                                </button>

                                <button
                                    onClick={logoutUser}
                                    className="w-full bg-white/5 backdrop-blur-sm 
                                        border border-white/20 text-gray-300 
                                        py-3.5 rounded-xl font-semibold
                                        hover:bg-red-600/20 hover:border-red-500/50 hover:text-red-400
                                        transition-all duration-300
                                        transform hover:scale-[1.02] group/btn"
                                >
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="text-xl">🚪</span>
                                        Logout
                                    </span>
                                </button>
                            </div>

                            {/* Footer Note */}
                            <p className="text-center text-xs text-gray-600 mt-6">
                                Keep your account secure. Do not share your credentials.
                            </p>
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

export default Userdetail;