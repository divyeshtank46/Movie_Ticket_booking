
import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { getMovies } from "../services/Movieservice";
import MovieCard from "../components/Moviecard";
import Loader from "../components/Loader";
import { useLocation } from "react-router-dom";
import "../styles/index.css";

const Movies = ({ excludeMovieId, limit }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");
    const [sortBy, setSortBy] = useState("latest");

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const searchQuery = query.get("search") || "";

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

    // Filter + Search + Limit
    const filteredMovies = useMemo(() => {
        let list = excludeMovieId
            ? movies.filter((movie) => movie._id !== excludeMovieId)
            : [...movies];

        // ✅ SEARCH FILTER
        if (searchQuery) {
            list = list.filter((movie) =>
                movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply limit if specified
        if (limit) list = list.slice(0, limit);

        return list;
    }, [movies, excludeMovieId, limit, searchQuery]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-20">
                <Loader />
            </div>
        );
    }

    if (!loading && filteredMovies.length === 0) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] pt-20">
                <div className="max-w-2xl mx-auto text-center px-4">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 
                        rounded-3xl p-16">
                        <span className="text-8xl mb-6 block animate-pulse">🎬</span>
                        <h2 className="text-3xl font-bold text-white mb-3">No Movies Found</h2>
                        <p className="text-gray-400 text-lg">
                            Check back later for new releases and exciting shows!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-r from-red-600/20 via-purple-600/20 to-blue-600/20"></div>

                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 via-purple-500 to-blue-500"></div>

                <div className="relative bg-black/40 backdrop-blur-xl border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-8 py-16">
                        <h1 className="text-7xl font-bold text-center mb-4 
                            bg-linear-to-r from-red-500 via-purple-500 to-blue-500 
                            bg-clip-text text-transparent animate-gradient">
                            MOVIES
                        </h1>

                        <p className="text-gray-400 text-center text-xl max-w-3xl mx-auto">
                            Explore our extensive collection of blockbuster hits, timeless classics,
                            and the latest releases. Find your next favorite movie.
                        </p>

                        <div className="w-32 h-1 bg-linear-to-r from-red-500 to-blue-500 mx-auto mt-6"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-16">
                {/* Filter Bar */}
                <div className="mb-10 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="bg-white/5 backdrop-blur-sm px-5 py-2.5 rounded-full 
                        border border-white/10 text-base order-2 lg:order-1">
                        <span className="text-gray-400">Showing </span>
                        <span className="text-white font-semibold">{filteredMovies.length}</span>
                        <span className="text-gray-400"> movies</span>
                    </div>

                    <div className="flex gap-3 order-1 lg:order-2 w-full lg:w-auto">
                        <div className="relative flex-1 lg:flex-none">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full lg:w-40 bg-white/5 backdrop-blur-sm 
                                    text-white px-4 py-2.5 rounded-full 
                                    border border-white/10 cursor-pointer
                                    hover:bg-white/10 transition-colors duration-300
                                    appearance-none outline-none text-sm"
                            >
                                <option value="all" className="bg-gray-900">All Languages</option>
                                <option value="english" className="bg-gray-900">English</option>
                                <option value="hindi" className="bg-gray-900">Hindi</option>
                                <option value="tamil" className="bg-gray-900">Tamil</option>
                                <option value="telugu" className="bg-gray-900">Telugu</option>
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <span className="text-gray-400">▼</span>
                            </div>
                        </div>

                        <div className="relative flex-1 lg:flex-none">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full lg:w-40 bg-white/5 backdrop-blur-sm 
                                    text-white px-4 py-2.5 rounded-full 
                                    border border-white/10 cursor-pointer
                                    hover:bg-white/10 transition-colors duration-300
                                    appearance-none outline-none text-sm"
                            >
                                <option value="latest" className="bg-gray-900">Latest</option>
                                <option value="popular" className="bg-gray-900">Popular</option>
                                <option value="price-low" className="bg-gray-900">Price: Low to High</option>
                                <option value="price-high" className="bg-gray-900">Price: High to Low</option>
                                <option value="duration" className="bg-gray-900">Duration</option>
                            </select>
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                <span className="text-gray-400">▼</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Movies Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
                    {filteredMovies.map((movie) => (
                        <div key={movie._id} className="w-full">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>

                {!limit && filteredMovies.length > 0 && (
                    <div className="mt-12 text-center">
                        <button className="bg-white/5 backdrop-blur-sm 
                            text-white px-8 py-3 rounded-xl font-medium
                            border border-white/10
                            hover:bg-white/10 transition-all duration-300
                            transform hover:scale-[1.02]">
                            Load More Movies
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default Movies;