import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { getMovieById } from "../services/Movieservice";
import Shows from "./Shows";

const Moviedetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);

        const fetchMovie = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getMovieById(id);
                setMovie(res.data);
            } catch (err) {
                setError("Failed to load movie details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchMovie();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-black pt-20 sm:pt-24">
            <Loader />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-black pt-20 sm:pt-24">
            <div className="max-w-2xl mx-auto text-center px-4">
                <div className="bg-red-900/30 border border-red-800 rounded-xl sm:rounded-2xl p-8 sm:p-12 md:p-16">
                    <span className="text-5xl sm:text-6xl md:text-7xl mb-4 sm:mb-6 block">❌</span>
                    <p className="text-red-400 text-base sm:text-lg md:text-xl">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 sm:px-8 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg
                        hover:bg-red-700 transition-colors duration-300 text-sm sm:text-base"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );

    if (!movie) return (
        <div className="min-h-screen bg-black pt-20 sm:pt-24">
            <div className="max-w-2xl mx-auto text-center px-4">
                <div className="bg-gray-900 border border-gray-800 rounded-xl sm:rounded-2xl p-8 sm:p-12 md:p-16">
                    <span className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 block">🎬</span>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">Movie not found</h2>
                    <p className="text-gray-400 text-sm sm:text-base md:text-lg">The movie you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/movies')}
                        className="mt-6 px-6 sm:px-8 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 text-sm sm:text-base"
                    >
                        Browse Movies
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Hero Section with Movie Backdrop - Fixed padding */}
            <div className="relative overflow-hidden pt-20 sm:pt-24 md:pt-28">
                {/* Background Blurred Poster */}
                <div
                    className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-20"
                    style={{ backgroundImage: `url(${movie.poster})` }}
                ></div>

                {/* Decorative Film Strip */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>

                {/* Main Content */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
                    <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12">
                        {/* Poster - Left Side */}
                        <div className="shrink-0 mx-auto lg:mx-0">
                            <div className="relative group">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-60 sm:w-72 md:w-80 rounded-xl sm:rounded-2xl shadow-2xl border border-gray-800
                                    group-hover:border-red-600 transition-all duration-500
                                    transform group-hover:scale-[1.02]"
                                />
                                {/* Rating Badge */}
                                {movie.rating && (
                                    <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 
                                        bg-red-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-sm sm:text-base
                                        border border-gray-800 shadow-xl">
                                        ⭐ {movie.rating}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Movie Details - Right Side */}
                        <div className="flex-1">
                            {/* Title - Properly sized */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                                {movie.title}
                            </h1>

                            {/* Quick Info Chips */}
                            <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <span className="bg-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full 
                                    border border-gray-800 text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                                    <span className="text-red-500">🎬</span> {movie.language || "N/A"}
                                </span>
                                <span className="bg-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full 
                                    border border-gray-800 text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                                    <span className="text-red-500">⏱️</span> {movie.duration || "-"} min
                                </span>
                                <span className="bg-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full 
                                    border border-gray-800 text-xs sm:text-sm flex items-center gap-1 sm:gap-2">
                                    <span className="text-red-500">📅</span> {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : "TBD"}
                                </span>
                                <span className={`bg-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full 
                                    border border-gray-800 text-xs sm:text-sm flex items-center gap-1 sm:gap-2
                                    ${movie.status === 'Now Showing' ? 'text-green-400' : 'text-yellow-400'}`}>
                                    <span className="w-1.5 h-1.5 bg-current rounded-full"></span>
                                    {movie.status || "Unknown"}
                                </span>
                            </div>

                            {/* Genre Chips */}
                            {movie.genre && movie.genre.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-6">
                                    {movie.genre.map((g, i) => (
                                        <span key={i}
                                            className="text-xs bg-red-900/50 text-red-400 
                                            px-2.5 sm:px-3 py-1 rounded-full border border-red-800">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Price Card */}
                            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                                    <span className="text-gray-400 text-sm sm:text-base">Ticket Price Range</span>
                                    <span className="text-xl sm:text-2xl font-bold text-red-500">
                                        ₹{movie.minPrice || "150"} - ₹{movie.maxPrice || "350"}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6 sm:mb-8">
                                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center gap-2">
                                    <span className="w-1 h-5 sm:h-6 bg-red-600 rounded-full"></span>
                                    About the Movie
                                </h3>
                                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
                                    {movie.description || "No description available."}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <button
                                    onClick={() => {
                                        document.getElementById('shows-section').scrollIntoView({ 
                                            behavior: 'smooth' 
                                        });
                                    }}
                                    className="flex-1 bg-red-600 
                                        text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg
                                        hover:bg-red-700
                                        transition-all duration-300
                                        hover:scale-[1.02] hover:shadow-lg hover:shadow-red-900/30"
                                >
                                    View Show Times →
                                </button>

                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-5 sm:px-6 py-3 sm:py-4 bg-gray-900 
                                        border border-gray-800 text-gray-300 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base
                                        hover:bg-gray-800 transition-all duration-300
                                        flex items-center justify-center gap-2"
                                >
                                    <span>←</span> Back
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 flex flex-wrap gap-3 sm:gap-4">
                                {movie.director && <span>Director: {movie.director}</span>}
                                {movie.cast && movie.cast.length > 0 && (
                                    <span>Cast: {movie.cast.slice(0, 3).join(', ')}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shows Section with ID for scrolling */}
            <div id="shows-section" className="mt-4 sm:mt-6">
                <Shows movieId={movie._id} />
            </div>
        </div>
    );
};

export default Moviedetail;