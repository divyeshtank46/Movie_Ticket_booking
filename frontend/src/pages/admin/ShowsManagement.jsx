import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdAccessTime,
    MdDateRange,
    MdMovie,
    MdSearch,
    MdFilterList,
    MdClose,
    MdTheaters,
    MdAttachMoney,
    MdEventSeat,
} from "react-icons/md";
import { FaRupeeSign, FaTicketAlt } from "react-icons/fa";
import { getMovies } from "../../services/Movieservice";
import { deleteShowById, getShowsByMovieId } from "../../services/Showservice";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ShowsManagement = () => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedMovie, setSelectedMovie] = useState(null);
    const [movies, setMovies] = useState([]);
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCinema, setSelectedCinema] = useState("all");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const { movieId } = useParams();

    // Get unique cinemas for filter
    const uniqueCinemas = [...new Set(shows.map(show => show.cinemaId?.Name).filter(Boolean))];

    // Filter shows based on search and cinema
    const filteredShows = shows.filter(show => {
        const matchesSearch = show.movieId?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             show.cinemaId?.Name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCinema = selectedCinema === "all" || show.cinemaId?.Name === selectedCinema;
        return matchesSearch && matchesCinema;
    });

    // fetch movies
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchMovies = async () => {
            try {
                const res = await getMovies();
                setMovies(res);
                if (res.length > 0 && !movieId) {
                    handleMovieClick(res[0]);
                } else if (movieId && res.length > 0) {
                    const movie = res.find(m => m._id === movieId);
                    if (movie) handleMovieClick(movie);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load movies ❌");
            }
        };

        fetchMovies();
    }, [movieId]);

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
            setSearchTerm("");
            setSelectedCinema("all");

            const res = await getShowsByMovieId(movie._id);
            setShows(res || []);
        } catch (err) {
            console.log(err);
            toast.error("Failed To Load Shows ❌");
        } finally {
            setLoading(false);
        }
    };

    const getAvailabilityStatus = (show) => {
        const availableSeats = show.totalSeats - (show.bookedSeats?.length || 0);
        const percentage = (availableSeats / show.totalSeats) * 100;
        
        if (percentage === 0) return { text: "Housefull", color: "text-red-400", bg: "bg-red-900/20" };
        if (percentage < 20) return { text: "Limited", color: "text-orange-400", bg: "bg-orange-900/20" };
        if (percentage < 50) return { text: "Available", color: "text-yellow-400", bg: "bg-yellow-900/20" };
        return { text: "Plenty", color: "text-green-400", bg: "bg-green-900/20" };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
            <div className="flex gap-6 p-6 max-w-7xl mx-auto">
                {/* Mobile Sidebar Toggle */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden fixed bottom-6 right-6 z-50 p-3 bg-red-600 rounded-full shadow-lg"
                >
                    <MdMovie size={24} />
                </button>

                {/* Sidebar */}
                <AnimatePresence>
                    {(isSidebarOpen || window.innerWidth >= 1024) && (
                        <motion.div
                            initial={{ x: -300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            className={`fixed lg:relative lg:w-80 w-72 bg-gray-900/95 backdrop-blur-sm border border-gray-800 rounded-2xl p-4 h-[calc(100vh-3rem)] overflow-y-auto z-40 ${
                                !isSidebarOpen && window.innerWidth < 1024 ? 'hidden' : ''
                            }`}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
                                    <MdMovie className="text-red-400" />
                                    Movies
                                </h2>
                                {window.innerWidth < 1024 && (
                                    <button onClick={() => setIsSidebarOpen(false)}>
                                        <MdClose className="text-gray-400" />
                                    </button>
                                )}
                            </div>

                            <div className="space-y-1">
                                {movies.map((movie) => (
                                    <motion.button
                                        key={movie._id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            handleMovieClick(movie);
                                            if (window.innerWidth < 1024) setIsSidebarOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200
                                        ${selectedMovie === movie._id
                                                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg"
                                                : "hover:bg-gray-800 text-gray-300"
                                            }`}
                                    >
                                        <div className="font-medium">{movie.title}</div>
                                        <div className="text-xs opacity-75 mt-1">
                                            {movie.language || "Multiple Languages"}
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
                                    Shows Management
                                </h1>
                                <p className="text-gray-400 text-sm mt-2">
                                    Manage show timings, prices, and availability
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <div className="relative">
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl
                                        text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-transparent
                                        transition-all duration-200"
                                    />
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 
                                    rounded-xl text-white font-medium shadow-lg hover:shadow-red-600/25
                                    transition-all duration-300"
                                >
                                    <MdAdd size={20} />
                                    Add Show
                                </motion.button>
                            </div>
                        </div>

                        {/* Filters Bar */}
                        <div className="mt-6 flex flex-wrap gap-3 items-center">
                            <div className="relative flex-1 min-w-[200px]">
                                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by movie or cinema..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl
                                    text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600/50"
                                />
                            </div>
                            
                            {uniqueCinemas.length > 0 && (
                                <select
                                    value={selectedCinema}
                                    onChange={(e) => setSelectedCinema(e.target.value)}
                                    className="px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white
                                    focus:outline-none focus:ring-2 focus:ring-red-600/50 cursor-pointer"
                                >
                                    <option value="all">All Cinemas</option>
                                    {uniqueCinemas.map(cinema => (
                                        <option key={cinema} value={cinema}>{cinema}</option>
                                    ))}
                                </select>
                            )}
                            
                            {(searchTerm || selectedCinema !== "all") && (
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedCinema("all");
                                    }}
                                    className="px-4 py-2.5 bg-gray-800 rounded-xl text-gray-300 hover:bg-gray-700
                                    transition-all duration-200"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Shows Grid/Cards View */}
                    {loading ? (
                        <div className="flex justify-center items-center h-96">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
                        </div>
                    ) : filteredShows.length === 0 ? (
                        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
                            <FaTicketAlt className="mx-auto text-6xl text-gray-700 mb-4" />
                            <p className="text-gray-400 text-lg">No shows found</p>
                            <p className="text-gray-500 text-sm mt-2">Try adjusting your filters</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                            {filteredShows.map((show, index) => {
                                const availability = getAvailabilityStatus(show);
                                const availableSeats = show.totalSeats - (show.bookedSeats?.length || 0);
                                
                                return (
                                    <motion.div
                                        key={show._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileHover={{ y: -4 }}
                                        className="group bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl 
                                        overflow-hidden hover:border-gray-700 transition-all duration-300"
                                    >
                                        {/* Movie Header */}
                                        <div className="p-5 pb-3 border-b border-gray-800">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white group-hover:text-red-400 
                                                    transition-colors duration-200">
                                                        {show.movieId?.title}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <MdTheaters className="text-gray-500 text-sm" />
                                                        <p className="text-sm text-gray-400">
                                                            {show.cinemaId?.Name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className={`px-2.5 py-1 text-xs rounded-full border ${availability.bg} ${availability.color} border-current/20`}>
                                                    {availability.text}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Show Details */}
                                        <div className="p-5 space-y-3">
                                            <div className="flex items-center justify-between text-sm">
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <MdDateRange className="text-red-400" />
                                                    <span>{show.showDate}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <MdAccessTime className="text-red-400" />
                                                    <span>{show.showTime}</span>
                                                </div>
                                            </div>

                                            {/* Price & Seats */}
                                            <div className="flex items-center justify-between pt-2">
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">Starting from</div>
                                                    <div className="flex items-center gap-1">
                                                        <FaRupeeSign className="text-red-400 text-sm" />
                                                        <span className="text-2xl font-bold text-white">
                                                            {show.price?.silver || "N/A"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-500 mb-1">Available Seats</div>
                                                    <div className="flex items-center gap-2">
                                                        <MdEventSeat className="text-green-400" />
                                                        <span className="text-xl font-semibold text-white">
                                                            {availableSeats}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            /{show.totalSeats}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Progress Bar */}
                                            <div className="mt-2">
                                                <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${(availableSeats / show.totalSeats) * 100}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Status Badge */}
                                            <div className="pt-2">
                                                <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-lg
                                                    ${show.movieId?.status === 'Now showing' 
                                                        ? 'bg-green-900/30 text-green-400 border border-green-800/50' 
                                                        : 'bg-yellow-900/30 text-yellow-400 border border-yellow-800/50'}`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${show.movieId?.status === 'Now showing' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                                                    {show.movieId?.status || "Coming Soon"}
                                                </span>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 pt-3 border-t border-gray-800">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex-1 py-2 bg-gray-800 rounded-xl text-gray-300 
                                                    hover:bg-gray-700 transition-all duration-200 text-sm font-medium"
                                                >
                                                    <MdEdit className="inline mr-1" size={16} />
                                                    Edit
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={async () => {
                                                        const result = await Swal.fire({
                                                            title: "Delete Show?",
                                                            text: `Remove "${show.movieId?.title}" show at ${show.showTime}?`,
                                                            icon: "warning",
                                                            showCancelButton: true,
                                                            confirmButtonColor: "#ef4444",
                                                            cancelButtonColor: "#6b7280",
                                                            confirmButtonText: "Yes, delete it!",
                                                            cancelButtonText: "Cancel",
                                                            background: "#1f2937",
                                                            color: "#ffffff",
                                                        });

                                                        if (result.isConfirmed) {
                                                            try {
                                                                await deleteShowById(show._id);
                                                                toast.success("Show deleted successfully");
                                                                setShows(prev => prev.filter(s => s._id !== show._id));
                                                            } catch (err) {
                                                                toast.error(err.response?.data?.message || "Failed to delete show");
                                                            }
                                                        }
                                                    }}
                                                    className="flex-1 py-2 bg-red-900/30 rounded-xl text-red-400 
                                                    hover:bg-red-900/50 transition-all duration-200 text-sm font-medium"
                                                >
                                                    <MdDelete className="inline mr-1" size={16} />
                                                    Delete
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}

                    {/* Summary Stats */}
                    {filteredShows.length > 0 && (
                        <div className="mt-8 p-4 bg-gray-900/50 rounded-xl border border-gray-800">
                            <div className="flex flex-wrap justify-between gap-4 text-sm">
                                <div>
                                    <span className="text-gray-500">Total Shows:</span>
                                    <span className="ml-2 text-white font-semibold">{filteredShows.length}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Total Cinemas:</span>
                                    <span className="ml-2 text-white font-semibold">{uniqueCinemas.length}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Selected Date:</span>
                                    <span className="ml-2 text-white font-semibold">{selectedDate}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ShowsManagement;