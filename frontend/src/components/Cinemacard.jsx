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
        <div className="group bg-black rounded-2xl overflow-hidden shadow-xl 
            hover:shadow-2xl hover:shadow-red-900/20 
            transform hover:-translate-y-1 transition-all duration-300
            border border-gray-800 hover:border-red-800">

            {/* Header */}
            <div className="p-5 border-b border-gray-800">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-red-500 mb-1">
                            {cinema.Name}
                        </h2>
                        <p className="text-gray-400 text-sm flex items-center gap-1">
                            <span>📍</span> {cinema.City}
                        </p>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                        ${cinema.Status === 'Active' ? 'bg-green-900 text-green-400 border border-green-800' :
                            'bg-yellow-900 text-yellow-400 border border-yellow-800'}`}>
                        {cinema.Status || 'Active'}
                    </span>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="relative">
                <div className="grid grid-cols-3 gap-1 p-1">
                    {cinema.Images?.slice(0, 3).map((image, index) => (
                        <div
                            key={index}
                            className="relative aspect-square overflow-hidden bg-gray-900"
                        >
                            <img
                                src={image || fallback}
                                alt={cinema.Name}
                                loading="lazy"
                                onError={(e) => (e.target.src = fallback)}
                                className="w-full h-full object-cover 
                                    group-hover:scale-110 transition-transform duration-500"
                            />

                            {/* Image number overlay for 3+ images */}
                            {index === 2 && cinema.Images?.length > 3 && (
                                <div className="absolute inset-0 bg-black bg-opacity-70 
                                    flex items-center justify-center">
                                    <span className="text-white font-bold text-lg">
                                        +{cinema.Images.length - 3}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Screen Count Badge */}
                <div className="absolute top-3 left-3 bg-black border border-red-800
                    text-white text-sm font-bold px-3 py-1.5 rounded-full 
                    flex items-center gap-2">
                    <span>🎬</span>
                    {cinema.TotalScreens} Screens
                </div>
            </div>

            {/* Details Section */}
            <div className="p-5 space-y-4">
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
                        <p className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                            <span className="w-1 h-4 bg-red-600 rounded-full"></span>
                            Facilities
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {cinema.Facilities.map((facility, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1.5 
                                        bg-gray-900 
                                        text-gray-300 text-xs rounded-lg
                                        border border-gray-700
                                        hover:bg-red-900 hover:border-red-700 hover:text-white
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
                    <button className="flex-1 bg-red-600 
                        text-white py-2.5 rounded-lg font-medium
                        hover:bg-red-700
                        transition-all duration-300
                        hover:scale-[1.02]">
                        View Shows →
                    </button>

                    <button className="px-4 bg-gray-800 
                        text-white rounded-lg border border-gray-700
                        hover:bg-gray-700 transition-all duration-300
                        hover:scale-[1.02]">
                        <span className="text-xl">📍</span>
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-gray-900 
                border-t border-gray-800 flex justify-between items-center text-xs">
                <span className="text-gray-500">
                    Cinema ID: #{cinema._id?.slice(-6) || 'N/A'}
                </span>
                <span className="text-green-500 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    Open Now
                </span>
            </div>
        </div>
    );
});

export default CinemaCard;