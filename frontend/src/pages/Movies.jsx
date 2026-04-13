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

        // Language filter
        if (filter !== "all") {
            list = list.filter((movie) =>
                movie.language?.toLowerCase() === filter.toLowerCase()
            );
        }

        // Sort
        if (sortBy === "latest") {
            list = list.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        } else if (sortBy === "popular") {
            list = list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortBy === "price-low") {
            list = list.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortBy === "price-high") {
            list = list.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (sortBy === "duration") {
            list = list.sort((a, b) => (b.duration || 0) - (a.duration || 0));
        }

        // Search filter
        if (searchQuery) {
            list = list.filter((movie) =>
                movie.title?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply limit if specified
        if (limit) list = list.slice(0, limit);

        return list;
    }, [movies, excludeMovieId, limit, searchQuery, filter, sortBy]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center pt-20">
                <Loader />
            </div>
        );
    }

    if (!loading && filteredMovies.length === 0) {
        return (
            <div className="min-h-screen bg-black pt-20">
                <div className="max-w-2xl mx-auto text-center px-4">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-16">
                        <span className="text-8xl mb-6 block">🎬</span>
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
        <div className="min-h-screen bg-black text-white pt-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Decorative Film Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

                {/* Header */}
                <div className="relative bg-gray-900 border-b border-gray-800">
                    <div className="max-w-7xl mx-auto px-8 py-16">
                        <h1 className="text-7xl font-bold text-center mb-4 text-red-500">
                            MOVIES
                        </h1>

                        <p className="text-gray-400 text-center text-xl max-w-3xl mx-auto">
                            Explore our extensive collection of blockbuster hits, timeless classics,
                            and the latest releases. Find your next favorite movie.
                        </p>

                        <div className="w-32 h-0.5 bg-red-600 mx-auto mt-6"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-16">
                {/* Filter Bar */}
                <div className="mb-10 flex flex-col lg:flex-row justify-between items-center gap-6">
                    <div className="bg-gray-900 px-5 py-2.5 rounded-full border border-gray-800 text-base order-2 lg:order-1">
                        <span className="text-gray-400">Showing </span>
                        <span className="text-white font-semibold">{filteredMovies.length}</span>
                        <span className="text-gray-400"> movies</span>
                    </div>

                    <div className="flex gap-3 order-1 lg:order-2 w-full lg:w-auto">
                        <div className="relative flex-1 lg:flex-none">
                            <select
                                value={filter}
                                onChange={(e) => setFilter(e.target.value)}
                                className="w-full lg:w-40 bg-gray-900 
                                    text-white px-4 py-2.5 rounded-full 
                                    border border-gray-800 cursor-pointer
                                    hover:bg-gray-800 transition-colors duration-300
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
                                className="w-full lg:w-40 bg-gray-900 
                                    text-white px-4 py-2.5 rounded-full 
                                    border border-gray-800 cursor-pointer
                                    hover:bg-gray-800 transition-colors duration-300
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
                        <button className="bg-gray-900 
                            text-white px-8 py-3 rounded-xl font-medium
                            border border-gray-800
                            hover:bg-gray-800 transition-all duration-300
                            hover:scale-[1.02]">
                            Load More Movies
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Movies;