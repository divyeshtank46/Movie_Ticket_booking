import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center pt-20">
            <div className="max-w-md mx-auto text-center px-4">
                <div className="text-8xl font-bold mb-4 text-red-500">
                    404
                </div>

                <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
                <p className="text-gray-400 mb-6">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        to="/"
                        className="px-6 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition"
                    >
                        Go Home
                    </Link>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;