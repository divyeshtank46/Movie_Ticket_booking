import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { getMovies } from "../services/Movieservice";
import MovieCard from "../components/Moviecard";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";
import "../styles/index.css";

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // ⭐ First 4 movies
    const homeMovies = useMemo(() => movies.slice(0, 4), [movies]);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-20">
            {/* Hero Section with Glass Effect */}
            <div className="relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-linear-to-r from-red-600/20 via-purple-600/20 to-blue-600/20"></div>
                
                {/* Decorative Film Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 via-purple-500 to-blue-500"></div>
                
                {/* Header with Glass Effect */}
                <div className="relative bg-black/40 backdrop-blur-xl border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-8 py-16">
                        <h1 className="text-7xl font-bold text-center mb-4 
                            bg-linear-to-r from-red-500 via-purple-500 to-blue-500 
                            bg-clip-text text-transparent animate-gradient">
                            NOW SHOWING
                        </h1>
                        
                        <p className="text-gray-400 text-center text-xl max-w-3xl mx-auto">
                            Discover the latest blockbusters and timeless classics. 
                            Book your tickets now for the ultimate cinema experience.
                        </p>
                        
                        <div className="w-32 h-1 bg-linear-to-r from-red-500 to-blue-500 mx-auto mt-6"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-8 py-16">
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center min-h-125">
                        <Loader />
                    </div>
                )}

                {/* No Movies Found */}
                {!loading && homeMovies.length === 0 && (
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 
                            rounded-3xl p-16">
                            <span className="text-8xl mb-6 block animate-pulse">🎬</span>
                            <h2 className="text-3xl font-bold text-white mb-3">No Movies Found</h2>
                            <p className="text-gray-400 text-lg">
                                Check back later for new releases and exciting shows!
                            </p>
                        </div>
                    </div>
                )}

                {/* Movies Grid */}
                {!loading && homeMovies.length > 0 && (
                    <>
                        {/* Results Count with Glass Effect */}
                        <div className="mb-10 flex justify-between items-center">
                            <div className="bg-white/5 backdrop-blur-sm px-5 py-2.5 rounded-full 
                                border border-white/10 text-base">
                                <span className="text-gray-400">Now Showing </span>
                                <span className="text-white font-semibold">{homeMovies.length}</span>
                                <span className="text-gray-400"> movies</span>
                            </div>
                            
                            {/* View All Link */}
                            <Link to="/movies">
                                <div className="bg-white/5 backdrop-blur-sm px-5 py-2.5 rounded-full 
                                    border border-white/10 text-base cursor-pointer
                                    hover:bg-white/10 transition-colors duration-300
                                    flex items-center gap-2 group">
                                    <span className="text-gray-400">View All Movies</span>
                                    <span className="text-white group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                            </Link>
                        </div>

                        {/* Movies Grid - Desktop Optimized */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {homeMovies.map((movie) => (
                                <div key={movie._id} className="w-full">
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>

                        {/* Featured Section */}
                        <div className="mt-20 relative">
                            <div className="absolute inset-0 bg-linear-to-r from-red-500/10 via-purple-500/10 to-blue-500/10 
                                rounded-3xl blur-3xl"></div>
                            
                            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 
                                rounded-2xl p-12 text-center">
                                <h3 className="text-3xl font-bold mb-4 
                                    bg-linear-to-r from-red-500 to-blue-500 
                                    bg-clip-text text-transparent">
                                    Experience Cinema Like Never Before
                                </h3>
                                <p className="text-gray-400 text-lg mb-8 max-w-3xl mx-auto">
                                    Book your favorite movies, choose the best seats, and enjoy premium 
                                    sound and picture quality at CINEBOOK.
                                </p>
                                <Link to="/movies">
                                    <button className="bg-linear-to-r from-red-600 to-purple-600 
                                        text-white px-10 py-4 rounded-xl font-medium text-lg
                                        hover:from-red-700 hover:to-purple-700
                                        transition-all duration-300
                                        transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30">
                                        Browse All Movies
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Add gradient animation keyframes */}
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

export default Home;