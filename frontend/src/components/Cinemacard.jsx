import React from "react";

const CinemaCard = React.memo(({ cinema }) => {
    const fallback = "https://via.placeholder.com/300x200?text=Cinema";

    // Facility icons mapping
    const facilityIcons = {
        'Parking': '🅿️',
        'Food Court': '🍔',
        'Dolby Atmos': '🔊',
        'IMAX': '🎥',
        'Wheelchair Access': '♿',
        'Recliner Seats': '💺',
        'Online Booking': '📱',
        'Credit Card': '💳',
        'VIP Lounge': '👑',
        '3D': '👓'
    };

    return (
        <div className="group bg-linear-to-b from-gray-900 to-black 
            rounded-2xl overflow-hidden shadow-2xl 
            hover:shadow-2xl hover:shadow-red-500/20 
            transform hover:-translate-y-2 transition-all duration-500
            border border-white/10 hover:border-red-500/50">

            {/* Header with Glass Effect */}
            <div className="relative p-5 bg-white/5 backdrop-blur-sm border-b border-white/10">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold bg-linear-to-r from-red-500 to-purple-500 
                            bg-clip-text text-transparent mb-1">
                            {cinema.Name}
                        </h2>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                            <span>📍</span> {cinema.City}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${cinema.Status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'}`}>
                        {cinema.Status || 'Active'}
                    </span>
                </div>
            </div>

            {/* Image Gallery with Glass Overlay */}
            <div className="relative">
                <div className="grid grid-cols-3 gap-1 p-1">
                    {cinema.Images?.slice(0, 3).map((image, index) => (
                        <div
                            key={index}
                            className="relative aspect-square overflow-hidden rounded-lg"
                        >
                            <img
                                src={image || fallback}
                                alt={cinema.Name}
                                loading="lazy"
                                onError={(e) => (e.target.src = fallback)}
                                className="w-full h-full object-cover 
                                    group-hover:scale-110 transition-transform duration-700"
                            />

                            {/* Image number overlay for 3+ images */}
                            {index === 2 && cinema.Images?.length > 3 && (
                                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm 
                                    flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        +{cinema.Images.length - 3}
                                    </span>
                                </div>
                            )}

                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent 
                                opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            </div>
                        </div>
                    ))}
                </div>

                {/* Screen Count Badge */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm 
                    text-white text-sm font-bold px-3 py-1.5 rounded-full 
                    border border-red-500/50 flex items-center gap-2">
                    <span>🎬</span>
                    {cinema.TotalScreens} Screens
                </div>
            </div>

            {/* Details Section with Glass Effect */}
            <div className="p-5 space-y-4 bg-white/5 backdrop-blur-sm">
                {/* Address and Contact */}
                <div className="space-y-2">
                    <p className="text-gray-300 text-sm flex items-start gap-2">
                        <span className="text-red-500 mt-1">📍</span>
                        <span>{cinema.Address}</span>
                    </p>

                    <p className="text-gray-300 text-sm flex items-center gap-2">
                        <span className="text-red-500">📞</span>
                        <a href={`tel:${cinema.ContactNumber}`}
                            className="hover:text-red-400 transition-colors">
                            {cinema.ContactNumber}
                        </a>
                    </p>
                </div>

                {/* Facilities with Icons */}
                {cinema.Facilities?.length > 0 && (
                    <div>
                        <p className="text-sm font-semibold text-gray-200 mb-3 flex items-center gap-2">
                            <span className="w-1 h-4 bg-red-500 rounded-full"></span>
                            Facilities
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {cinema.Facilities.map((facility, index) => (
                                <span
                                    key={index}
                                    className="group/facility relative px-3 py-1.5 
                                        bg-white/10 backdrop-blur-sm 
                                        text-gray-300 text-xs rounded-lg
                                        border border-white/20
                                        hover:bg-red-500/20 hover:border-red-500/30
                                        hover:text-white
                                        transition-all duration-300
                                        flex items-center gap-1"
                                >
                                    <span>{facilityIcons[facility] || '✨'}</span>
                                    {facility}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <button className="flex-1 bg-linear-to-r from-red-600 to-purple-600 
                        text-white py-2.5 rounded-xl font-medium
                        hover:from-red-700 hover:to-purple-700
                        transition-all duration-300
                        transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30
                        relative overflow-hidden group/btn">
                        <span className="absolute inset-0 bg-white/20 transform 
                            -translate-x-full group-hover/btn:translate-x-0 
                            transition-transform duration-500"></span>
                        <span className="relative flex items-center justify-center gap-2">
                            View Shows
                            <span className="text-lg">→</span>
                        </span>
                    </button>

                    <button className="px-4 bg-white/10 backdrop-blur-sm 
                        text-white rounded-xl border border-white/20
                        hover:bg-white/20 transition-all duration-300
                        transform hover:scale-[1.02]">
                        <span className="text-xl">📍</span>
                    </button>
                </div>
            </div>

            {/* Footer with Glass Effect */}
            <div className="px-5 py-3 bg-black/40 backdrop-blur-sm 
                border-t border-white/10 flex justify-between items-center text-xs">
                <span className="text-gray-500">
                    Cinema ID: #{cinema._id?.slice(-6) || 'N/A'}
                </span>
                <span className="text-gray-400 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Open Now
                </span>
            </div>
        </div>
    );
});

export default CinemaCard;