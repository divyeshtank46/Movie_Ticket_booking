import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { FiSearch } from "react-icons/fi";

const Header = () => {
    const { user, loading } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [search, setSearch] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (loading) return null;

    const navLinks = [
        { name: "Home", path: "/" },
        { name: "Movies", path: "/movies" },
        { name: "Cinemas", path: "/cinemas" },
        { name: "My Bookings", path: "/bookings" },
        { name: "Contact", path: "/contact-us" },
        { name: "About", path: "/about" },
    ];

    const isActive = (path) => location.pathname === path;

    const firstLetter =
        user?.Name?.charAt(0)?.toUpperCase() ||
        user?.Email?.charAt(0)?.toUpperCase();

    const handleSearch = (e) => {
        e.preventDefault();
        if (!search.trim()) return;
        navigate(`/movies?search=${search}`);
        setMenuOpen(false);
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? "bg-black/80 backdrop-blur-xl shadow-2xl border-b border-white/10"
                    : "bg-linear-to-b from-black/90 via-black/50 to-transparent backdrop-blur-sm"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    
                    {/* Logo */}
                    <Link to="/" className="group relative">
                        <span className="text-2xl lg:text-3xl font-bold bg-linear-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
                            CINEBOOK
                        </span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-linear-to-r from-red-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                        {/* <span className="ml-1 text-2xl lg:text-3xl filter drop-shadow-lg">🎬</span> */}
                    </Link>

                    {/* Search Bar Desktop */}
                    <form
                        onSubmit={handleSearch}
                        className="hidden lg:flex items-center relative mx-6 flex-1 max-w-md"
                    >
                        <FiSearch className="absolute left-3 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 
                            bg-white/5 backdrop-blur-sm border border-white/10 
                            rounded-full text-sm text-white placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-red-500/50
                            transition-all duration-300"
                        />
                    </form>
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                to={link.path}
                                className={`relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 ${
                                    isActive(link.path)
                                        ? "text-white bg-white/10 backdrop-blur-sm"
                                        : "text-gray-300 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-500 rounded-full"></span>
                                )}
                            </Link>
                        ))}
                    </nav>
                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {!user && (
                            <Link
                                to="/login"
                                className="relative px-5 py-2 text-sm font-medium text-white overflow-hidden rounded-full group"
                            >
                                <span className="absolute inset-0 w-full h-full bg-linear-to-r from-red-600 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></span>
                                <span className="absolute inset-0 w-full h-full bg-white/20 backdrop-blur-sm"></span>
                                <span className="relative z-10">Login</span>
                            </Link>
                        )}
                        {user && (
                            <Link to="/user-detail">
                                <div className="relative w-10 h-10 flex items-center justify-center
                                    bg-linear-to-br from-red-500 to-purple-600 text-white font-bold rounded-full
                                    hover:scale-110 hover:shadow-lg hover:shadow-red-500/30
                                    transition-all duration-300 cursor-pointer group">
                                    <span className="relative z-10">{firstLetter}</span>
                                    <span className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
                                </div>
                            </Link>
                        )}
                        {/* Hamburger */}
                        <button
                            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <div className="space-y-1.5">
                                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}></span>
                                <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                            </div>
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
                        menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="py-4 space-y-1 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 mb-4">
                        {/* Mobile Search */}
                        <form onSubmit={handleSearch} className="px-4 pb-3">
                            <div className="relative">
                                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search movies..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 
                                    bg-white/5 backdrop-blur-sm border border-white/10 
                                    rounded-full text-sm text-white placeholder-gray-400
                                    focus:outline-none"
                                />
                            </div>
                        </form>
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                to={link.path}
                                className={`block px-4 py-3 text-sm font-medium transition-all duration-300 ${
                                    isActive(link.path)
                                        ? "text-white bg-white/10 border-l-4 border-red-500"
                                        : "text-gray-300 hover:text-white hover:bg-white/5 hover:border-l-4 hover:border-white/20"
                                }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user && (
                            <div className="px-4 py-3 mt-2 border-t border-white/10">
                                <p className="text-xs text-gray-400">Signed in as</p>
                                <p className="text-sm font-medium text-white">
                                    {user.Name || user.Email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
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
        </header>
    );
};

export default Header;