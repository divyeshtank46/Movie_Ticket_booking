import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex items-center justify-center pt-20">
            <div className="max-w-md mx-auto text-center px-4">
                <div className="text-8xl font-bold mb-4 bg-linear-to-r from-red-500 to-purple-500 bg-clip-text text-transparent">
                    404
                </div>

                <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
                <p className="text-gray-400 mb-6">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="px-6 py-2 bg-linear-to-r from-red-600 to-purple-600 rounded-lg hover:from-red-700 hover:to-purple-700 transition"
                    >
                        Go Home
                    </Link>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;