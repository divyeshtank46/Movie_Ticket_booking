import React, { useEffect, useState } from "react";
import { getCinemas } from "../services/Cinemaservice";
import Cinemacard from "../components/Cinemacard";
import Loader from "../components/Loader";
import '../styles/index.css'

const CinemaPage = () => {
    const [cinemas, setCinemas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCinema = async () => {
            try {
                const data = await getCinemas();
                setCinemas(data);
            } catch (err) {
                setError("Failed to load cinemas");
            } finally {
                setLoading(false);
            }
        };

        fetchCinema();
    }, []);

    return (
        <div className="min-h-screen bg-black text-white pt-20">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Decorative Film Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>
                
                {/* Header */}
                <div className="relative bg-gray-900 border-b border-gray-800">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <h1 className="text-5xl md:text-6xl font-bold text-center mb-4 text-red-500">
                            CINEMAS
                        </h1>
                        
                        <p className="text-gray-400 text-center text-lg max-w-2xl mx-auto">
                            Experience movies in the finest cinemas across the city.
                            Premium sound, crystal clear visuals, and ultimate comfort.
                        </p>
                        
                        <div className="w-24 h-0.5 bg-red-600 mx-auto mt-6"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {loading && (
                    <div className="flex justify-center items-center min-h-100">
                        <Loader />
                    </div>
                )}

                {error && (
                    <div className="max-w-md mx-auto text-center">
                        <div className="bg-red-900 border border-red-800 rounded-2xl p-8">
                            <span className="text-6xl mb-4 block">🎬</span>
                            <p className="text-red-400 text-lg mb-2">Oops! Something went wrong</p>
                            <p className="text-gray-400 text-sm">{error}</p>
                            <button 
                                onClick={() => window.location.reload()}
                                className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg
                                hover:bg-red-700 transition-colors duration-300"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                {!loading && cinemas.length === 0 && (
                    <div className="max-w-md mx-auto text-center">
                        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12">
                            <span className="text-7xl mb-6 block">🎥</span>
                            <h2 className="text-2xl font-bold text-white mb-3">No Cinemas Found</h2>
                            <p className="text-gray-400">
                                We couldn't find any cinemas in your area. 
                                Please check back later.
                            </p>
                        </div>
                    </div>
                )}

                {!loading && cinemas.length > 0 && (
                    <>
                        {/* Results Count */}
                        <div className="mb-8 flex justify-between items-center">
                            <div className="bg-gray-900 px-4 py-2 rounded-full border border-gray-800 text-sm">
                                <span className="text-gray-400">Showing </span>
                                <span className="text-white font-semibold">{cinemas.length}</span>
                                <span className="text-gray-400"> cinemas</span>
                            </div>
                            
                            {/* Filter/Sort Placeholder */}
                            <div className="bg-gray-900 px-4 py-2 rounded-full border border-gray-800 text-sm cursor-pointer hover:bg-gray-800 transition-colors duration-300">
                                <span className="text-gray-400">Sort by ▼</span>
                            </div>
                        </div>

                        {/* Cinema Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cinemas.map((cinema) => (
                                <Cinemacard
                                    key={cinema._id}
                                    cinema={cinema}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CinemaPage;