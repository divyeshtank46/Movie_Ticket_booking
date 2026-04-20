import React, { useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { getMovies } from "../services/Movieservice";
import MovieCard from "../components/Moviecard";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

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

    // First 4 movies
    const homeMovies = useMemo(() => movies.slice(0, 4), [movies]);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section - Removed extra header, just padding top */}
            <div className="relative overflow-hidden pt-20 sm:pt-24 md:pt-28">
                {/* Decorative Film Strip */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-red-600 via-red-500 to-red-600"></div>
                
                {/* Main Title - Moved down with proper spacing */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="font-extrabold mb-3 sm:mb-4">
                            <span className="bg-linear-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight">
                                NOW SHOWING
                            </span>
                        </h1>
                        
                        <p className="text-gray-300 text-center text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 font-light leading-relaxed">
                            Discover the latest blockbusters and timeless classics. 
                            Book your tickets now for the <span className="text-red-400 font-medium">ultimate cinema experience</span>.
                        </p>
                        
                        {/* Decorative divider */}
                        <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4 sm:mt-5">
                            <div className="w-12 sm:w-16 h-0.5 bg-linear-to-r from-transparent to-red-600"></div>
                            <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                            <div className="w-12 sm:w-16 h-0.5 bg-linear-to-l from-transparent to-red-600"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">
                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center min-h-[50vh] sm:min-h-[60vh]">
                        <Loader />
                    </div>
                )}

                {/* No Movies Found */}
                {!loading && homeMovies.length === 0 && (
                    <div className="max-w-2xl mx-auto text-center px-4">
                        <div className="bg-linear-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl sm:rounded-2xl p-8 sm:p-10 md:p-12">
                            <span className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-5 block">🎬</span>
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 tracking-tight">
                                No Movies Found
                            </h2>
                            <p className="text-gray-400 text-base sm:text-lg font-light">
                                Check back later for new releases and exciting shows!
                            </p>
                        </div>
                    </div>
                )}

                {/* Movies Grid */}
                {!loading && homeMovies.length > 0 && (
                    <>
                        {/* Results Count & View All */}
                        <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
                            <div className="bg-linear-to-rrom-gray-900 to-gray-800 px-5 sm:px-6 py-2 rounded-full border border-gray-700">
                                <span className="text-gray-300 text-sm sm:text-base font-medium">🎥 Now Showing </span>
                                <span className="text-white font-semibold text-base sm:text-lg">{homeMovies.length}</span>
                                <span className="text-gray-300 text-sm sm:text-base font-medium"> movies</span>
                            </div>
                            
                            <Link to="/movies">
                                <div className="group bg-linear-to-r from-gray-900 to-gray-800 px-5 sm:px-6 py-2 rounded-full 
                                    border border-gray-700 cursor-pointer
                                    hover:from-gray-800 hover:to-gray-700
                                    transition-all duration-300
                                    flex items-center gap-2">
                                    <span className="text-gray-200 text-sm sm:text-base font-medium">View All Movies</span>
                                    <span className="text-red-500 group-hover:translate-x-1 transition-transform text-base sm:text-lg">→</span>
                                </div>
                            </Link>
                        </div>

                        {/* Movies Container with Horizontal Scroll for Mobile */}
                        <div className="relative">
                            {/* Desktop Grid View (lg and above) */}
                            <div className="hidden lg:grid lg:grid-cols-4 gap-6 md:gap-7">
                                {homeMovies.map((movie) => (
                                    <div key={movie._id} className="w-full transform transition-all duration-300 hover:scale-[1.02] hover:z-10">
                                        <MovieCard movie={movie} />
                                    </div>
                                ))}
                            </div>

                            {/* Tablet Grid View (md to lg) */}
                            <div className="hidden md:grid lg:hidden grid-cols-2 gap-6">
                                {homeMovies.map((movie) => (
                                    <div key={movie._id} className="w-full transform transition-all duration-300 hover:scale-[1.02] hover:z-10">
                                        <MovieCard movie={movie} />
                                    </div>
                                ))}
                            </div>

                            {/* Mobile Horizontal Scroll View (below md) */}
                            <div className="md:hidden overflow-x-auto overflow-y-hidden pb-4 -mx-4 px-4 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-gray-600 [&::-webkit-scrollbar-thumb]:rounded-full">
                                <div className="flex gap-4" style={{ minWidth: 'min-content' }}>
                                    {homeMovies.map((movie) => (
                                        <div key={movie._id} className="w-[calc(50%-0.5rem)] shrink-0">
                                            <MovieCard movie={movie} />
                                        </div>
                                    ))}
                                </div>
                                {/* Scroll Indicator Dots */}
                                {homeMovies.length > 2 && (
                                    <div className="flex justify-center gap-2 mt-5">
                                        {homeMovies.map((_, idx) => (
                                            <div 
                                                key={idx} 
                                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                                    idx === 0 ? 'bg-red-500 w-3' : 'bg-gray-600 w-1.5'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Featured Section */}
                        <div className="mt-16 sm:mt-20 md:mt-24">
                            <div className="relative bg-linear-to-br from-gray-900 via-gray-900 to-black border border-gray-800 rounded-xl sm:rounded-2xl p-8 sm:p-10 md:p-12 text-center overflow-hidden">
                                {/* Background decoration */}
                                <div className="absolute inset-0 opacity-5">
                                    <div className="absolute top-0 -left-4 w-56 h-56 bg-red-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                                    <div className="absolute top-0 -right-4 w-56 h-56 bg-purple-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
                                </div>
                                
                                <div className="relative z-10">
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5">
                                        <span className="bg-linear-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                                            Experience Cinema Like Never Before
                                        </span>
                                    </h3>
                                    
                                    <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                                        Book your favorite movies, choose the best seats, and enjoy premium 
                                        sound and picture quality at <span className="text-red-400 font-semibold">CINEBOOK</span>.
                                    </p>
                                    
                                    <Link to="/movies">
                                        <button className="group relative bg-linear-to-r from-red-600 to-red-700 
                                            text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 md:py-4 
                                            rounded-xl font-semibold text-base sm:text-lg md:text-xl
                                            hover:from-red-700 hover:to-red-800
                                            transition-all duration-300
                                            hover:scale-105
                                            shadow-lg hover:shadow-red-500/25
                                            w-full sm:w-auto">
                                            <span className="relative z-10 flex items-center justify-center gap-2">
                                                Browse All Movies
                                                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                                            </span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;