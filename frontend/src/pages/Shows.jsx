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
            <div className="min-h-screen bg-black pt-20">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-20 relative overflow-hidden">
            {/* Decorative Film Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

            {/* Background Movie Icons */}
            <div className="absolute top-20 left-10 text-6xl opacity-5">🎬</div>
            <div className="absolute bottom-20 right-10 text-6xl opacity-5">🎥</div>

            {/* Main Container */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 text-red-500">
                        SHOW TIMINGS
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Find show times for your favorite movies across all cinemas
                    </p>
                    <div className="w-24 h-0.5 bg-red-600 mx-auto mt-6"></div>
                </div>

                {/* Date Filter - Horizontal Scroll */}


                {/* Cinema Filter - Quick Select */}
                {filteredCinemas.length > 0 && (
                    <div className="mb-8">
                        <div className="bg-gray-900 rounded-xl p-3 
                            border border-gray-800 inline-flex items-center gap-2">
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
                            <div className="flex-1 h-px bg-gray-800"></div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCinema(null)}
                                className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedCinema === null
                                    ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                                    : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
                                    }`}
                            >
                                All Cinemas
                            </button>
                            {filteredCinemas.map((cinemaGroup) => (
                                <button
                                    key={cinemaGroup.cinema?._id}
                                    onClick={() => setSelectedCinema(cinemaGroup.cinema?._id)}
                                    className={`px-4 py-2 rounded-lg text-sm transition-all ${selectedCinema === cinemaGroup.cinema?._id
                                        ? "bg-red-600 text-white shadow-lg shadow-red-900/30"
                                        : "bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700"
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
                            <div className="mb-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-red-900/20 rounded-full flex items-center justify-center">
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
                                <div key={cinemaGroup.cinema?._id} className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
                                    <div className="p-4 border-b border-gray-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-900/20 rounded-full flex items-center justify-center">
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
                                            <div className="ml-auto bg-gray-800 px-3 py-1 rounded-full text-xs text-gray-400">
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
                        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-16">
                            <span className="text-8xl mb-6 block">🎬</span>
                            <h2 className="text-3xl font-bold text-white mb-3">No Shows Found</h2>
                            <p className="text-gray-400 text-lg mb-8">
                                There are no shows available for the selected filters.
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedDate("all");
                                    setSelectedCinema(null);
                                }}
                                className="bg-red-600 text-white px-8 py-4 rounded-xl font-medium text-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-900/30"
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

// Compact Show Card with Original Styling
const ShowCard = ({ show, onClick }) => {
    const bookedSeats = show.bookedSeats?.length || 0;
    const availableSeats = show.totalSeats - bookedSeats;
    const occupancyPercentage = (bookedSeats / show.totalSeats) * 100;

    return (
        <button
            onClick={() => onClick(show)}
            className="group bg-gray-900 border border-gray-800 rounded-xl p-3 hover:border-red-800 hover:bg-red-900/20 transition-all duration-300 text-center w-full"
        >
            {/* Show Time */}
            <div className="text-center mb-2">
                <span className="inline-block px-2 py-1 bg-red-600 text-white text-xs font-bold rounded-full">
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
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-red-600"
                    style={{
                        width: `${occupancyPercentage}%`
                    }}
                ></div>
            </div>
        </button>
    );
};

export default Shows;