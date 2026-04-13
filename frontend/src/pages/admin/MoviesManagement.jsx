import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdAdd, MdEdit, MdDelete, MdSearch, MdFilterList } from "react-icons/md";
import { deleteMovieById, getMovies } from "../../services/Movieservice";
import { toast } from "react-toastify";
import { Link, useNavigate } from 'react-router-dom'
import Swal from "sweetalert2";

const MoviesManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [movies, setMovies] = useState([]);
    const [, setLoading] = useState(true);
    
    const handleEdit = (id) => {
        navigate(`/admin/editmovie/${id}`);
    }
    
    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchMovies = async () => {
            try {
                const res = await getMovies();
                setMovies(res);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load movies ❌");
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, []);

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterStatus === "all" || movie.status === filterStatus)
    );

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-red-500">
                        Movies Management
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage all movies across all cinemas
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/addmovie"
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 
                        rounded-xl text-white font-medium
                        hover:bg-red-700 transition-all duration-300
                        transform hover:scale-[1.02]"
                    >
                        <MdAdd size={20} />
                        Add New Movie
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-xl
                            text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                            focus:ring-red-600/50"
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl
                            text-white focus:outline-none focus:ring-2 focus:ring-red-600/50"
                    >
                        <option value="all">All Status</option>
                        <option value="Now showing">Now showing</option>
                        <option value="Upcoming">Upcoming</option>
                    </select>

                    <button className="p-2 bg-gray-800 border border-gray-700 rounded-xl
                        hover:bg-gray-700 transition-colors">
                        <MdFilterList size={20} />
                    </button>
                </div>
            </div>

            {/* Movies Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMovies.map((movie, index) => (
                    <MovieCard
                        key={movie._id}
                        movie={movie}
                        index={index}
                        onEdit={() => handleEdit(movie._id)}
                    />
                ))}
            </div>
        </div>
    );
};

const MovieCard = ({ movie, index, onEdit }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden
            hover:border-red-800 hover:bg-red-900/10 transition-all duration-300 group"
        >
            <div className="relative h-96 overflow-hidden">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="font-bold text-lg line-clamp-2 text-white">
                        {movie.title}
                    </h3>
                </div>
            </div>

            <div className="p-3 flex justify-end gap-2">
                <button
                    onClick={onEdit}
                    className="p-2 hover:bg-blue-900/50 rounded-lg transition-colors
                    text-blue-400 border border-blue-800">
                    <MdEdit size={18} />
                </button>

                <button
                    className="p-2 hover:bg-red-900/50 rounded-lg transition-colors
                    text-red-400 border border-red-800"
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
                                await deleteMovieById(movie._id);
                                window.location.reload();
                                toast.success("Movie Successfully Deleted");
                            } catch (err) {
                                toast.error(err.message || "Failed To Delete Movie");
                            }
                        }
                    }}
                >
                    <MdDelete size={18} />
                </button>
            </div>
        </motion.div>
    )
};

export default MoviesManagement;