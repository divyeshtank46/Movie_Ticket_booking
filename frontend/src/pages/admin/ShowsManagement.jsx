import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdAccessTime,
    MdDateRange,
    MdMovie,
} from "react-icons/md";
import { FaRupeeSign } from "react-icons/fa";
import { getMovies } from "../../services/Movieservice";
import { deleteShowById, getShowsByMovieId } from "../../services/Showservice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ShowsManagement = () => {
    const [selectedDate, setSelectedDate] = useState("2024-03-20");
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movies, setmovies] = useState([]);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(false);

    const { movieId } = useParams();

    // fetch movies
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchMovies = async () => {
            try {
                const res = await getMovies();
                setmovies(res);
                if (res.length > 0) {
                    handleMovieClick(res[0]);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load movies ❌");
            }
        };

        fetchMovies();
    }, []);

    useEffect(() => {
        if (!movieId) return;

        const fetchShows = async () => {
            try {
                setLoading(true);
                const res = await getShowsByMovieId(movieId);
                setShows(res || []);
            } catch (err) {
                console.log(err);
                toast.error("Failed To Load Shows ❌");
            } finally {
                setLoading(false);
            }
        };

        fetchShows();
    }, [movieId]);

    // sidebar click fetch
    const handleMovieClick = async (movie) => {
        try {
            setSelectedMovie(movie._id);
            setLoading(true);

            const res = await getShowsByMovieId(movie._id);
            console.log(res)
            setShows(res || []);
        } catch (err) {
            console.log(err);
            toast.error("Failed To Load Shows ❌");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-6 p-6">
            {/* Sidebar */}
            <div className="w-72 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 h-fit">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <MdMovie className="text-red-400" />
                    Movies
                </h2>

                <div className="space-y-2">
                    {movies.map((movie, index) => (
                        <motion.button
                            key={movie._id}
                            whileHover={{ scale: 1.02 }}
                            onClick={() => handleMovieClick(movie)}
                            className={`w-full text-left px-3 py-2 rounded-xl transition-all
                            ${selectedMovie === movie._id
                                    ? "bg-linear-to-r from-red-600 to-purple-600 text-white"
                                    : "hover:bg-white/5 text-gray-300"
                                }`}
                        >
                            {movie.title}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold bg-linear-to-r from-red-500 to-purple-500 
                        bg-clip-text text-transparent">
                            Shows Management
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Manage show timings, prices, and availability
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl
                            text-white focus:outline-none focus:ring-2 focus:ring-red-500/30"
                        />

                        <button className="flex items-center gap-2 px-4 py-2 bg-linear-to-r 
                        from-red-600 to-purple-600 rounded-xl text-white font-medium
                        hover:from-red-700 hover:to-purple-700 transition-all duration-300">
                            <MdAdd size={20} />
                            Add Show
                        </button>
                    </div>
                </div>

                {/* Shows Table */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="text-left p-4 text-sm font-medium text-gray-400">
                                    Movie
                                </th>
                                <th className="text-left p-4 text-sm font-medium text-gray-400">
                                    Cinema
                                </th>
                                <th className="text-left p-4 text-sm font-medium text-gray-400">
                                    Date & Time
                                </th>
                                <th className="text-left p-4 text-sm font-medium text-gray-400">
                                    Lawest Prices
                                </th>
                                <th className="text-left p-4 text-sm font-medium text-gray-400">
                                    Availability
                                </th>
                                <th className="text-left p-4 text-sm font-medium text-gray-400">
                                    Status
                                </th>
                                <th className="text-left p-4 text-sm font-medium text-gray-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {shows.map((show, index) => (
                                <motion.tr
                                    key={show._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="border-b border-white/5 hover:bg-white/5"
                                >
                                    <td className="p-4">
                                        <p className="font-medium">
                                            {show.movieId?.title}
                                        </p>
                                    </td>

                                    <td className="p-4 text-sm text-gray-400">
                                        {show.cinemaId?.Name}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex flex-col text-sm">
                                            <span className="flex items-center gap-1">
                                                <MdDateRange className="text-gray-500" />
                                                {show.showDate}
                                            </span>

                                            <span className="flex items-center gap-1 text-gray-400">
                                                <MdAccessTime className="text-gray-500" />
                                                {show.showTime}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="p-4">
                                        ₹{show.price.silver}
                                    </td>

                                    <td className="p-4">
                                        {show.totalSeats - show.bookedSeats.length}/{show.totalSeats}
                                    </td>

                                    <td className="p-4 text-green-700">

                                        {show.movieId
                                            .status}

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
                                                        background: "#0a0a0f",
                                                        color: "#ffffff",
                                                        iconColor: "#ef4444",
                                                        customClass: {
                                                            popup: 'rounded-2xl border border-white/20 backdrop-blur-xl bg-white/5',
                                                            confirmButton: 'bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 transition-all',
                                                            cancelButton: 'bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 transition-all border border-white/20'
                                                        }
                                                    });

                                                    if (result.isConfirmed) {
                                                        try {
                                                            await deleteShowById(show._id);
                                                            toast.success("Show Deleted Successfully");
                                                            setShows(prev => prev.filter(s => s._id !== show._id));
                                                        } catch (err) {
                                                            toast.error(err.response?.data?.message || "Failed To Delete Show");
                                                        }
                                                    }
                                                }}
                                                className="p-1.5 bg-white/5 backdrop-blur-sm border border-white/20 
        rounded-lg transition-all duration-300 text-red-400
        hover:bg-red-500/20 hover:border-red-500/50 hover:scale-110
        focus:outline-none focus:ring-2 focus:ring-red-500/50"
                                            >
                                                <MdDelete size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ShowsManagement;