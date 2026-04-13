import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdSearch, MdFilterList, MdMoreVert, MdVisibility, MdDelete } from "react-icons/md";
import { getAllBookings } from "../../services/Admin/getAllBookings";
import { toast } from "react-toastify";
import { useAuth } from "../../context/Authcontext";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";
import { deletebooking } from "../../services/Bookingservice";

const BookingsManagement = () => {
    const { user } = useAuth();
    const [bookings, setbookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchBookings = async () => {
            try {
                setLoading(true);
                const res = await getAllBookings();
                console.log("API:", res);
                const bookingsData = res?.data || [];
                setbookings(bookingsData);
                console.log("Bookings data:", bookingsData);
            } catch (err) {
                console.log(err);
                toast.error("Failed To Load Bookings");
                setbookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [user]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-green-900/50 text-green-400 border-green-800';
            case 'pending': return 'bg-yellow-900/50 text-yellow-400 border-yellow-800';
            case 'cancelled': return 'bg-red-900/50 text-red-400 border-red-800';
            default: return 'bg-green-900/50 text-green-400 border-green-800';
        }
    };

    const getCinemaName = (booking) => {
        if (booking.show?.cinemaId?.Name) {
            return booking.show.cinemaId.Name;
        }
        if (booking.cinema) {
            if (typeof booking.cinema === 'object' && booking.cinema.Name) {
                return booking.cinema.Name;
            }
            return "Cinema ID: " + booking.cinema;
        }
        return "N/A";
    };

    const getShowDate = (booking) => {
        if (booking.show?.showDate) {
            return new Date(booking.show.showDate).toLocaleDateString();
        }
        if (booking.bookingDate) {
            return new Date(booking.bookingDate).toLocaleDateString();
        }
        return "-";
    };

    const getShowTime = (booking) => {
        if (booking.show?.showTime) {
            return booking.show.showTime;
        }
        if (booking.showTime) {
            return booking.showTime;
        }
        return "-";
    };

    const getSeatType = (booking) => {
        if (booking.seatType) {
            return booking.seatType;
        }
        return "standard";
    };

    if (loading) {
        return <Loader />;
    }

    if (!bookings || bookings.length === 0) {
        return (
            <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-red-500">
                            Bookings Management
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            View and manage all ticket bookings
                        </p>
                    </div>
                </div>
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
                    <p className="text-gray-400">No bookings found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-red-500">
                        Bookings Management
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        View and manage all ticket bookings
                    </p>
                </div>
                <div className="flex gap-2">
                    <div className="relative">
                        <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg focus:outline-none focus:border-red-600 text-white placeholder-gray-500"
                        />
                    </div>
                    <button className="px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 flex items-center gap-2 text-gray-300">
                        <MdFilterList /> Filter
                    </button>
                </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-x-auto">
                <table className="w-full min-w-250">
                    <thead className="bg-gray-800 border-b border-gray-700">
                        <tr>
                            <th className="text-left p-4 text-sm text-gray-400">Booking ID</th>
                            <th className="text-left p-4 text-sm text-gray-400">User</th>
                            <th className="text-left p-4 text-sm text-gray-400">Movie</th>
                            <th className="text-left p-4 text-sm text-gray-400">Cinema</th>
                            <th className="text-left p-4 text-sm text-gray-400">Show Time</th>
                            <th className="text-left p-4 text-sm text-gray-400">Seats</th>
                            <th className="text-left p-4 text-sm text-gray-400">Amount</th>
                            <th className="text-left p-4 text-sm text-gray-400">Status</th>
                            <th className="text-left p-4 text-sm text-gray-400">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {bookings.map((booking, index) => {
                            const cinemaName = getCinemaName(booking);
                            const showDate = getShowDate(booking);
                            const showTime = getShowTime(booking);
                            const seatType = getSeatType(booking);

                            return (
                                <motion.tr
                                    key={booking._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="border-b border-gray-800 hover:bg-gray-800/50"
                                >
                                    <td className="p-4 text-sm font-mono text-gray-300">
                                        #{booking._id.slice(-6)}
                                    </td>

                                    <td className="p-4">
                                        <p className="font-medium text-white">
                                            {booking.user?.Name || "N/A"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "N/A"}
                                        </p>
                                    </td>

                                    <td className="p-4 text-sm text-gray-300">
                                        {booking.movie?.title || "N/A"}
                                    </td>

                                    <td className="p-4 text-sm text-gray-400">
                                        {cinemaName}
                                    </td>

                                    <td className="p-4">
                                        <p className="text-sm text-gray-300">{showDate}</p>
                                        <p className="text-xs text-gray-500">{showTime}</p>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                            {booking.seats?.map((seat, i) => (
                                                <span
                                                    key={i}
                                                    className="text-xs bg-red-900/50 text-red-400 px-1.5 py-0.5 rounded border border-red-800"
                                                >
                                                    {seat}
                                                </span>
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1 capitalize">
                                            {seatType}
                                        </p>
                                    </td>

                                    <td className="p-4 text-sm font-bold text-red-500">
                                        ₹{booking.totalPrice}
                                    </td>

                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(booking.status)}`}>
                                            {booking.status || "confirmed"}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-1">
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
                                                        background: "#1f2937",
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
                                                            setbookings(prev => prev.filter(b => b._id !== booking._id));
                                                        } catch (error) {
                                                            toast.error(error.message || "Failed To Delete Booking");
                                                        }
                                                    }
                                                }}
                                                className="p-1.5 hover:bg-red-900/50 rounded-lg text-red-400"
                                            >
                                                <MdDelete size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BookingsManagement;