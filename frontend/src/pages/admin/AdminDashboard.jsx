import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    MdMovie,
    MdTheaters,
    MdPeople,
    MdMoreVert,
    MdDelete,
    MdDeleteOutline,
    MdDeleteForever
} from 'react-icons/md';
import { BsFillCalendarEventFill } from 'react-icons/bs';
import RevenueChart from '../../components/admin/RevenueChart';
import { getMovies } from '../../services/Movieservice';
import { toast } from 'react-toastify';
import { getCinemas } from '../../services/Cinemaservice';
import { fetchAllShows } from '../../services/Showservice';
import { getAllUsers } from '../../services/Admin/getUsers';
import { Link } from 'react-router-dom'
import { getAllBookings } from '../../services/Admin/getAllBookings';
import Swal from 'sweetalert2';
import { deletebooking } from '../../services/Bookingservice';

const AdminDashboard = () => {

    const [movie, setMovie] = useState(0);
    const [cinema, setCinema] = useState(0);
    const [shows, setShows] = useState(0);
    const [users, setUsers] = useState(0);
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [moviesRes, cinemaRes, showsRes, usersRes, bookingRes] = await Promise.all([
                    getMovies(),
                    getCinemas(),
                    fetchAllShows(),
                    getAllUsers(),
                    getAllBookings()
                ]);
                setMovie(moviesRes.length);
                setCinema(cinemaRes.length);
                setShows(showsRes);
                setUsers(usersRes.length);
                setBookings(bookingRes.data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load dashboard data ❌");
            }
        };

        fetchDashboardData();
    }, []);

    const stats = [
        { icon: <MdMovie />, label: "Total Movies", value: movie, change: "+3", color: "bg-red-600" },
        { icon: <MdTheaters />, label: "Cinemas", value: cinema, change: "+1", color: "bg-purple-600" },
        { icon: <BsFillCalendarEventFill />, label: "Today's Shows", value: shows, change: "+12", color: "bg-blue-600" },
        { icon: <MdPeople />, label: "Total Users", value: users, change: "+1", color: "bg-green-600" },
    ];

    const topMovies = [
        { title: "Tu Duniya Chhe Mari", bookings: 1250, revenue: 187500, growth: "+12%" },
        { title: "KGF Chapter 3", bookings: 980, revenue: 176400, growth: "+8%" },
        { title: "Animal", bookings: 850, revenue: 127500, growth: "+5%" },
        { title: "Salaar", bookings: 720, revenue: 129600, growth: "+15%" },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-red-500">
                    Dashboard Overview
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                    Welcome back! Here's what's happening with your platform today.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard key={index} stat={stat} index={index} />
                ))}
            </div>

            {/* Charts and Tables Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Chart - Takes 2 columns on large screens */}
                <div className="lg:col-span-2">
                    <RevenueChart />
                </div>

                {/* Top Movies */}
                <div className="bg-gray-900 border border-gray-800 
                    rounded-2xl p-6 hover:border-red-800 transition-all duration-300">
                    <h3 className="text-lg font-semibold mb-4">Top Movies</h3>
                    <div className="space-y-4">
                        {topMovies.map((movie, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                                    <span className="text-lg">🎬</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{movie.title}</p>
                                    <p className="text-xs text-gray-400">{movie.bookings} bookings</p>
                                </div>
                                <span className="text-sm text-green-400">{movie.growth}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-gray-900 border border-gray-800 
                rounded-2xl p-6 hover:border-red-800 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Recent Bookings</h3>
                    <Link to={'/admin/bookings'} className="text-sm text-red-400 hover:text-red-300">
                        View All →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                                <th className="pb-3">Booking ID</th>
                                <th className="pb-3">Movie</th>
                                <th className="pb-3">Cinema</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Amount</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {bookings?.slice(0, 5).map((booking, i) => {
                                const status = booking?.status || "Confirmed";

                                return (
                                    <tr key={i} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                                        {/* Booking ID */}
                                        <td className="py-3 px-4 text-sm">
                                            <div className="relative group w-fit cursor-help">
                                                <span className="font-mono text-xs bg-gray-800 px-2 py-1 rounded-md border border-gray-700">
                                                    #{booking?._id?.slice(-6)}
                                                </span>

                                                {/* Tooltip */}
                                                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block 
                                                    bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg 
                                                    shadow-2xl whitespace-nowrap z-50 border border-gray-700">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-mono">{booking?._id}</span>
                                                    </div>
                                                    <div className="absolute left-3 -bottom-1 w-2 h-2 bg-gray-900 
                                                        border-r border-b border-gray-700 rotate-45"></div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Movie */}
                                        <td className="py-3 text-sm font-medium">
                                            {booking?.movie?.title || "N/A"}
                                        </td>

                                        {/* Cinema */}
                                        <td className="py-3 text-sm text-gray-300">
                                            {booking?.show?.cinemaId?.Name || "N/A"}
                                        </td>

                                        {/* Date */}
                                        <td className="py-3 text-sm text-gray-300">
                                            {booking?.bookingDate
                                                ? new Date(booking.bookingDate).toLocaleDateString("en-IN")
                                                : "N/A"
                                            }
                                        </td>

                                        {/* Amount */}
                                        <td className="py-3 text-sm font-semibold">
                                            ₹{booking?.totalPrice || 0}
                                        </td>

                                        {/* Status */}
                                        <td className="py-3">
                                            <span className={`
                                                px-2 py-1 text-xs rounded-full
                                                ${status === "Confirmed"
                                                    ? "bg-green-900/50 text-green-400 border border-green-800"
                                                    : status === "Pending"
                                                        ? "bg-yellow-900/50 text-yellow-400 border border-yellow-800"
                                                        : "bg-red-900/50 text-red-400 border border-red-800"
                                                }
                                            `}>
                                                {status}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className="py-3 text-right flex justify-center items-center">
                                            <button
                                                onClick={async () => {
                                                    const result = await Swal.fire({
                                                        title: "Are you sure?",
                                                        text: "You won't be able to revert this!",
                                                        icon: "warning",
                                                        showCancelButton: true,
                                                        confirmButtonColor: "#ef4444",
                                                        cancelButtonColor: "#6b7280",
                                                        confirmButtonText: "Yes, delete it!",
                                                        cancelButtonText: "Cancel",
                                                        background: "#111827",
                                                        color: "#ffffff",
                                                        iconColor: "#ef4444",
                                                        customClass: {
                                                            popup: 'rounded-2xl border border-gray-700 bg-gray-900',
                                                            confirmButton: 'bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 transition-all',
                                                            cancelButton: 'bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 transition-all border border-gray-600'
                                                        }
                                                    });

                                                    if (result.isConfirmed) {
                                                        try {
                                                            await deletebooking(booking._id);
                                                            toast.success("Booking Deleted Successfully");
                                                            setBookings(prev => prev.filter(b => b._id !== booking._id));
                                                        } catch (error) {
                                                            toast.error(error.message || "Failed To Delete Booking");
                                                        }
                                                    }
                                                }}
                                                className="p-1.5 hover:bg-red-900/50 rounded-lg text-red-400">
                                                <MdDelete size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Stat Card Component
const StatCard = ({ stat, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6
            hover:border-red-800 transition-all duration-300"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl ${stat.color} 
                flex items-center justify-center text-2xl text-white`}>
                {stat.icon}
            </div>
            <span className="text-sm text-green-400">{stat.change}</span>
        </div>
        <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
        <p className="text-gray-400 text-sm">{stat.label}</p>
    </motion.div>
);

export default AdminDashboard;