import { useEffect, useState } from "react";
import { getShowsByMovieId } from "../services/Showservice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

const Shows = ({ movieId }) => {
    const navigate = useNavigate();
    const [shows, setShows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState("all");
    const [selectedCinema, setSelectedCinema] = useState(null);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                const res = await getShowsByMovieId(movieId);
                setShows(res || []);
            } catch (err) {
                console.error(err);
                toast.error("Failed To Load Shows ❌");
            } finally {
                setLoading(false);
            }
        };
        fetchShows();
    }, [movieId]);


    const getShowsByDate = (date) => {
        if (date === "all") return shows;
        return shows.filter(show => show.showDate === date);
    };

    const getGroupedByCinema = (showsList) => {
        const grouped = showsList.reduce((acc, show) => {
            const cinemaId = show.cinemaId?._id || show.cinemaId;
            if (!acc[cinemaId]) {
                acc[cinemaId] = {
                    cinema: show.cinemaId,
                    shows: []
                };
            }
            acc[cinemaId].shows.push(show);
            return acc;
        }, {});
        return Object.values(grouped);
    };

    const filteredShows = getShowsByDate(selectedDate);
    const filteredCinemas = getGroupedByCinema(filteredShows);


    const handleShowClick = (show) => {
        navigate(`/booking/${show._id}`, {
            state: {
                selectedShow: show,
                selectedTime: show.showTime,
                selectedCinema: show.cinemaId
            }
        });
    };


    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] pt-20">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 relative overflow-hidden">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-red-600/10 via-purple-600/10 to-blue-600/10 animate-gradient-x"></div>

            {/* Decorative Film Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 via-purple-500 to-blue-500"></div>

            {/* Background Movie Icons */}
            <div className="absolute top-20 left-10 text-6xl opacity-5 animate-pulse">🎬</div>
            <div className="absolute bottom-20 right-10 text-6xl opacity-5 animate-pulse">🎥</div>

            {/* Main Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 
                        bg-linear-to-r from-red-500 via-purple-500 to-blue-500 
                        bg-clip-text text-transparent animate-gradient">
                        SHOW TIMINGS
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Find show times for your favorite movies across all cinemas
                    </p>
                    <div className="w-24 h-1 bg-linear-to-r from-red-500 to-blue-500 mx-auto mt-6"></div>
                </div>

                {/* Date Filter - Horizontal Scroll */}


                {/* Cinema Filter - Quick Select */}
                {filteredCinemas.length > 0 && (
                    <div className="mb-8">
                        {/* <span>Show Date {formatDate(Date.now())} </span> */}
                        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-3 
    border border-white/10 inline-flex items-center gap-2">
                            <span className="text-red-400 text-lg">📅</span>
                            <div>
                                <p className="text-xs text-gray-400">Show Date</p>
                                <p className="text-white font-medium">
                                    {new Date().toLocaleDateString("en-IN", {
                                        weekday: "long",
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm text-gray-400">🎬 Select Cinema</span>
                            <div className="flex-1 h-px bg-linear-to-r from-purple-500/50 to-transparent"></div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCinema(null)}
                                className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedCinema === null
                                    ? "bg-linear-to-r from-red-600 to-purple-600 text-white shadow-lg shadow-red-500/30"
                                    : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                                    }`}
                            >
                                All Cinemas
                            </button>
                            {filteredCinemas.map((cinemaGroup) => (
                                <button
                                    key={cinemaGroup.cinema?._id}
                                    onClick={() => setSelectedCinema(cinemaGroup.cinema?._id)}
                                    className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedCinema === cinemaGroup.cinema?._id
                                        ? "bg-linear-to-r from-red-600 to-purple-600 text-white shadow-lg shadow-red-500/30"
                                        : "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                                        }`}
                                >
                                    {cinemaGroup.cinema?.Name || cinemaGroup.cinema?.name} ({cinemaGroup.shows.length})
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Shows Display */}
                <div>
                    {selectedCinema !== null ? (
                        // Single Cinema View
                        <div>
                            <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                                        <span className="text-xl">🏢</span>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white">
                                            {filteredCinemas.find(c => c.cinema?._id === selectedCinema)?.cinema?.Name ||
                                                filteredCinemas.find(c => c.cinema?._id === selectedCinema)?.cinema?.name}
                                        </h2>
                                        <p className="text-sm text-gray-400">
                                            {filteredCinemas.find(c => c.cinema?._id === selectedCinema)?.cinema?.Address ||
                                                filteredCinemas.find(c => c.cinema?._id === selectedCinema)?.cinema?.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                {filteredCinemas.find(c => c.cinema?._id === selectedCinema)?.shows.map((show) => (
                                    <ShowCard key={show._id} show={show} onClick={handleShowClick} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        // All Cinemas View
                        <div className="space-y-6">
                            {filteredCinemas.map((cinemaGroup) => (
                                <div key={cinemaGroup.cinema?._id} className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                                    <div className="p-4 border-b border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                                                <span className="text-xl">🏢</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white text-lg">
                                                    {cinemaGroup.cinema?.Name || cinemaGroup.cinema?.name}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {cinemaGroup.cinema?.Address?.split(',')[0] || cinemaGroup.cinema?.address?.split(',')[0]}
                                                </p>
                                            </div>
                                            <div className="ml-auto bg-white/10 px-3 py-1 rounded-full text-xs">
                                                {cinemaGroup.shows.length} shows
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                                            {cinemaGroup.shows.map((show) => (
                                                <ShowCard key={show._id} show={show} onClick={handleShowClick} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* No Shows */}
                {filteredCinemas.length === 0 && (
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-16">
                            <span className="text-8xl mb-6 block animate-pulse">🎬</span>
                            <h2 className="text-3xl font-bold text-white mb-3">No Shows Found</h2>
                            <p className="text-gray-400 text-lg mb-8">
                                There are no shows available for the selected filters.
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedDate("all");
                                    setSelectedCinema(null);
                                }}
                                className="bg-linear-to-r from-red-600 to-purple-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:from-red-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }
                .animate-gradient-x {
                    background-size: 200% auto;
                    animation: gradient-x 3s ease infinite;
                }
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </div>
    );
};

// Compact Show Card with Original Styling
const ShowCard = ({ show, onClick }) => {
    const bookedSeats = show.bookedSeats?.length || 0;
    const availableSeats = show.totalSeats - bookedSeats;
    const occupancyPercentage = (bookedSeats / show.totalSeats) * 100;

    return (
        <button
            onClick={() => onClick(show)}
            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3 hover:border-red-500/50 hover:bg-red-500/5 transition-all duration-300 text-center w-full"
        >
            {/* Show Time */}
            <div className="text-center mb-2">
                <span className="inline-block px-2 py-1 bg-linear-to-r from-red-600 to-purple-600 text-white text-xs font-bold rounded-full">
                    {show.showTime}
                </span>
            </div>

            {/* Price Grid */}
            <div className="grid grid-cols-3 gap-1 mb-2">
                {show.price?.silver && (
                    <div className="text-center">
                        <p className="text-xs text-gray-500">Silver</p>
                        <p className="text-sm font-bold text-gray-300">
                            ₹{show.price.silver}
                        </p>
                    </div>
                )}
                {show.price?.gold && (
                    <div className="text-center">
                        <p className="text-xs text-gray-500">Gold</p>
                        <p className="text-sm font-bold text-yellow-400">
                            ₹{show.price.gold}
                        </p>
                    </div>
                )}
                {show.price?.platinum && (
                    <div className="text-center">
                        <p className="text-xs text-gray-500">Platinum</p>
                        <p className="text-sm font-bold text-blue-400">
                            ₹{show.price.platinum}
                        </p>
                    </div>
                )}
            </div>

            {/* Seats Left */}
            <div className="flex justify-between items-center text-xs mb-2">
                <span className="text-gray-500">
                    🪑 {availableSeats} left
                </span>
                <span className="text-red-400 group-hover:translate-x-1 transition-transform">
                    Select →
                </span>
            </div>

            {/* Booked Percentage Indicator */}
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-linear-to-r from-red-500 to-purple-500"
                    style={{
                        width: `${occupancyPercentage}%`
                    }}
                ></div>
            </div>
        </button>
    );
};

export default Shows;