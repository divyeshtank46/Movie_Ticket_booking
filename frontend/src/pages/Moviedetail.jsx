

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import { getMovieById } from "../services/Movieservice";
import '../styles/index.css'
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
        <div className="min-h-screen bg-[#0a0a0f] pt-20">
            <Loader />
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-[#0a0a0f] pt-20">
            <div className="max-w-2xl mx-auto text-center px-4">
                <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/20 
                    rounded-3xl p-16">
                    <span className="text-6xl mb-6 block">❌</span>
                    <p className="text-red-400 text-xl">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-3 bg-red-600 text-white rounded-xl
                        hover:bg-red-700 transition-colors duration-300"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );

    if (!movie) return (
        <div className="min-h-screen bg-[#0a0a0f] pt-20">
            <div className="max-w-2xl mx-auto text-center px-4">
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 
                    rounded-3xl p-16">
                    <span className="text-7xl mb-6 block">🎬</span>
                    <h2 className="text-3xl font-bold text-white mb-3">Movie not found</h2>
                    <p className="text-gray-400 text-lg">The movie you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/movies')}
                        className="mt-6 px-6 py-3 bg-linear-to-r from-red-600 to-purple-600 
                        text-white rounded-xl hover:from-red-700 hover:to-purple-700
                        transition-all duration-300"
                    >
                        Browse Movies
                    </button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-20">
            {/* Hero Section with Movie Backdrop */}
            <div className="relative overflow-hidden">
                {/* Background Blurred Poster */}
                <div
                    className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-30"
                    style={{ backgroundImage: `url(${movie.poster})` }}
                ></div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-r from-red-600/20 via-purple-600/20 to-blue-600/20"></div>

                {/* Decorative Film Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 via-purple-500 to-blue-500"></div>

                {/* Main Content */}
                <div className="relative max-w-7xl mx-auto px-8 py-16">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Poster - Left Side */}
                        <div className="shrink-0 mx-auto lg:mx-0">
                            <div className="relative group">
                                <img
                                    src={movie.poster}
                                    alt={movie.title}
                                    className="w-80 rounded-2xl shadow-2xl border-2 border-white/20
                                    group-hover:border-red-500/50 transition-all duration-500
                                    transform group-hover:scale-[1.02]"
                                />
                                {/* Rating Badge */}
                                {movie.rating && (
                                    <div className="absolute -top-3 -right-3 
                                        bg-linear-to-r from-red-600 to-purple-600 
                                        text-white px-4 py-2 rounded-full font-bold
                                        border-2 border-white/30 shadow-xl">
                                        ⭐ {movie.rating}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Movie Details - Right Side */}
                        <div className="flex-1">
                            {/* Title with Gradient */}
                            <h1 className="text-5xl font-bold mb-4 
                                bg-linear-to-r from-red-500 via-purple-500 to-blue-500 
                                bg-clip-text text-transparent">
                                {movie.title}
                            </h1>

                            {/* Quick Info Chips */}
                            <div className="flex flex-wrap gap-3 mb-6">
                                <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full 
                                    border border-white/20 text-sm flex items-center gap-2">
                                    <span className="text-red-500">🎬</span> {movie.language || "N/A"}
                                </span>
                                <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full 
                                    border border-white/20 text-sm flex items-center gap-2">
                                    <span className="text-red-500">⏱️</span> {movie.duration || "-"} min
                                </span>
                                <span className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full 
                                    border border-white/20 text-sm flex items-center gap-2">
                                    <span className="text-red-500">📅</span> {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString() : "TBD"}
                                </span>
                                <span className={`bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full 
                                    border border-white/20 text-sm flex items-center gap-2
                                    ${movie.status === 'Now Showing' ? 'text-green-400' : 'text-yellow-400'}`}>
                                    <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
                                    {movie.status || "Unknown"}
                                </span>
                            </div>

                            {/* Genre Chips */}
                            {movie.genre && movie.genre.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {movie.genre.map((g, i) => (
                                        <span key={i}
                                            className="text-xs bg-red-500/20 text-red-400 
                                            px-3 py-1 rounded-full border border-red-500/30">
                                            {g}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Price Card - Now showing range instead of single price */}
                            <div className="bg-linear-to-r from-red-600/20 to-purple-600/20 
                                backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-400">Ticket Price Range</span>
                                    <span className="text-2xl font-bold bg-linear-to-r 
                                        from-red-500 to-purple-500 bg-clip-text text-transparent">
                                        ₹{movie.minPrice || "150"} - ₹{movie.maxPrice || "350"}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-red-500 rounded-full"></span>
                                    About the Movie
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {movie.description || "No description available."}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => {
                                        // Scroll to shows section
                                        document.getElementById('shows-section').scrollIntoView({ 
                                            behavior: 'smooth' 
                                        });
                                    }}
                                    className="flex-1 bg-linear-to-r from-red-600 to-purple-600 
                                        text-white px-8 py-4 rounded-xl font-semibold text-lg
                                        hover:from-red-700 hover:to-purple-700
                                        transition-all duration-300
                                        transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30
                                        relative overflow-hidden group"
                                >
                                    <span className="absolute inset-0 bg-white/20 transform 
                                        -translate-x-full group-hover:translate-x-0 
                                        transition-transform duration-500"></span>
                                    <span className="relative flex items-center justify-center gap-2">
                                        View Show Times
                                        <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                                    </span>
                                </button>

                                <button
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-4 bg-white/5 backdrop-blur-sm 
                                        border border-white/20 text-gray-300 rounded-xl font-medium
                                        hover:bg-white/10 transition-all duration-300
                                        flex items-center justify-center gap-2"
                                >
                                    <span>←</span> Back
                                </button>
                            </div>

                            {/* Additional Info */}
                            <div className="mt-6 text-sm text-gray-500 flex flex-wrap gap-4">
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
            <div id="shows-section">
                <Shows movieId={movie._id} />
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

export default Moviedetail;