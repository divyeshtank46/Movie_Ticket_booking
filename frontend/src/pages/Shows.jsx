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
            <div className="min-h-screen bg-black pt-20 sm:pt-24">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Decorative Film Strip */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-red-600 via-red-500 to-red-600"></div>

            {/* Background Movie Icons */}
            <div className="absolute top-24 left-4 sm:left-10 text-4xl sm:text-6xl opacity-5">🎬</div>
            <div className="absolute bottom-20 right-4 sm:right-10 text-4xl sm:text-6xl opacity-5">🎥</div>

            {/* Main Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
                {/* Header */}
                <div className="text-center mb-8 sm:mb-10 md:mb-12 pt-16 sm:pt-20 md:pt-24">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
                        <span className="bg-linear-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                            SHOW TIMINGS
                        </span>
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
                        Find show times for your favorite movies across all cinemas
                    </p>
                    <div className="flex justify-center items-center gap-2 sm:gap-3 mt-4 sm:mt-5">
                        <div className="w-12 sm:w-16 h-0.5 bg-linear-to-r from-transparent to-red-600"></div>
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                        <div className="w-12 sm:w-16 h-0.5 bg-linear-to-l from-transparent to-red-600"></div>
                    </div>
                </div>

                {/* Cinema Filter */}
                {filteredCinemas.length > 0 && (
                    <div className="mb-6 sm:mb-8">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs sm:text-sm text-gray-300 font-medium">🎬 Select Cinema</span>
                            <div className="flex-1 h-px bg-gray-700"></div>
                        </div>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            <button
                                onClick={() => setSelectedCinema(null)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                                    selectedCinema === null
                                        ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                                        : "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
                                }`}
                            >
                                All Cinemas
                            </button>
                            {filteredCinemas.map((cinemaGroup) => (
                                <button
                                    key={cinemaGroup.cinema?._id}
                                    onClick={() => setSelectedCinema(cinemaGroup.cinema?._id)}
                                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                                        selectedCinema === cinemaGroup.cinema?._id
                                            ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                                            : "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700"
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
                            <div className="mb-4 p-3 sm:p-4 bg-gray-900 rounded-lg sm:rounded-xl border border-gray-700">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-900/30 rounded-full flex items-center justify-center">
                                        <span className="text-lg sm:text-xl">🏢</span>
                                    </div>
                                    <div>
                                        <h2 className="text-base sm:text-xl font-bold text-white">
                                            {filteredCinemas.find(c => c.cinema?._id === selectedCinema)?.cinema?.Name ||
                                                filteredCinemas.find(c => c.cinema?._id === selectedCinema)?.cinema?.name}
                                        </h2>
                                        <p className="text-xs sm:text-sm text-gray-400">
                                            {filteredCinemas.find(c => c.cinema?._id === selectedCinema)?.cinema?.Address ||
                                                filteredCinemas.find(c => c.cinema?._id === selectedCinema)?.cinema?.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                                {filteredCinemas.find(c => c.cinema?._id === selectedCinema)?.shows.map((show) => (
                                    <ShowCard key={show._id} show={show} onClick={handleShowClick} />
                                ))}
                            </div>
                        </div>
                    ) : (
                        // All Cinemas View
                        <div className="space-y-4 sm:space-y-6">
                            {filteredCinemas.map((cinemaGroup) => (
                                <div key={cinemaGroup.cinema?._id} className="bg-gray-900 rounded-lg sm:rounded-xl border border-gray-700 overflow-hidden">
                                    <div className="p-3 sm:p-4 border-b border-gray-700">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-900/30 rounded-full flex items-center justify-center">
                                                <span className="text-lg sm:text-xl">🏢</span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-white text-sm sm:text-lg">
                                                    {cinemaGroup.cinema?.Name || cinemaGroup.cinema?.name}
                                                </h3>
                                                <p className="text-xs text-gray-400">
                                                    {cinemaGroup.cinema?.Address?.split(',')[0] || cinemaGroup.cinema?.address?.split(',')[0]}
                                                </p>
                                            </div>
                                            <div className="ml-auto bg-gray-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs text-gray-300">
                                                {cinemaGroup.shows.length} shows
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3 sm:p-4">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
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
                    <div className="max-w-2xl mx-auto text-center px-4">
                        <div className="bg-gray-900 border border-gray-700 rounded-xl sm:rounded-2xl p-8 sm:p-12 md:p-16">
                            <span className="text-6xl sm:text-7xl md:text-8xl mb-4 sm:mb-6 block">🎬</span>
                            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-3">No Shows Found</h2>
                            <p className="text-gray-300 text-sm sm:text-base md:text-lg mb-6 sm:mb-8">
                                There are no shows available for the selected filters.
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedDate("all");
                                    setSelectedCinema(null);
                                }}
                                className="bg-red-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium text-sm sm:text-base md:text-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-900/30"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// Show Card with Better Font Colors for Visibility
const ShowCard = ({ show, onClick }) => {
    const bookedSeats = show.bookedSeats?.length || 0;
    const availableSeats = show.totalSeats - bookedSeats;
    const occupancyPercentage = (bookedSeats / show.totalSeats) * 100;

    return (
        <button
            onClick={() => onClick(show)}
            className="group bg-gray-900 border border-gray-700 rounded-lg sm:rounded-xl p-2 sm:p-3 hover:border-red-600 hover:bg-red-900/20 transition-all duration-300 text-center w-full"
        >
            {/* Show Time */}
            <div className="text-center mb-1.5 sm:mb-2">
                <span className="inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 bg-red-600 text-white text-xs font-bold rounded-full shadow-md">
                    {show.showTime}
                </span>
            </div>

            {/* Price Grid */}
            <div className="grid grid-cols-3 gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
                {show.price?.silver && (
                    <div className="text-center">
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Silver</p>
                        <p className="text-xs sm:text-sm font-bold text-gray-200">
                            ₹{show.price.silver}
                        </p>
                    </div>
                )}
                {show.price?.gold && (
                    <div className="text-center">
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Gold</p>
                        <p className="text-xs sm:text-sm font-bold text-yellow-400">
                            ₹{show.price.gold}
                        </p>
                    </div>
                )}
                {show.price?.platinum && (
                    <div className="text-center">
                        <p className="text-[10px] sm:text-xs text-gray-400 font-medium">Platinum</p>
                        <p className="text-xs sm:text-sm font-bold text-blue-400">
                            ₹{show.price.platinum}
                        </p>
                    </div>
                )}
            </div>

            {/* Seats Left */}
            <div className="flex justify-between items-center text-[10px] sm:text-xs mb-1.5 sm:mb-2">
                <span className="text-gray-300 font-medium">
                    🪑 <span className="text-white font-bold">{availableSeats}</span> left
                </span>
                <span className="text-red-500 font-medium group-hover:translate-x-1 transition-transform">
                    Select →
                </span>
            </div>

            {/* Booked Percentage Indicator */}
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-linear-to-r from-red-600 to-red-500 transition-all duration-300"
                    style={{
                        width: `${occupancyPercentage}%`
                    }}
                ></div>
            </div>
            
            {/* Occupancy Text */}
            <p className="text-[8px] sm:text-[10px] text-gray-500 mt-1">
                {Math.round(occupancyPercentage)}% booked
            </p>
        </button>
    );
};

export default Shows;