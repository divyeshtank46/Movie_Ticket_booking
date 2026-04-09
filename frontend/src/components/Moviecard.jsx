import React from "react";
import { useNavigate } from "react-router-dom";

const Moviecard = ({ movie }) => {
    const navigate = useNavigate();

    return (
        <div
            onClick={() => navigate(`/movie/${movie._id}`)}
            className="group bg-white dark:bg-gray-900 rounded-xl shadow-md 
            hover:shadow-xl transition-all duration-300 cursor-pointer
            border border-gray-200 dark:border-gray-800 overflow-hidden
            w-full max-w-60"
        >
            {/* Image Container */}
            <div className="relative w-full aspect-2/3 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                    onError={(e) => {
                        e.target.src =
                            "https://via.placeholder.com/300x450?text=No+Poster";
                    }}
                />

                {/* Overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
                    <h3 className="text-white font-semibold text-base line-clamp-2">
                        {movie.title}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default Moviecard;