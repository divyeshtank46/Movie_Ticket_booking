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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled
                    ? "bg-black/80 backdrop-blur-md shadow-lg border-b border-gray-800"
                    : "bg-transparent"
            }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    
                    {/* Logo */}
                    <Link to="/" className="group">
                        <span className="text-2xl lg:text-3xl font-bold text-red-500">
                            CINEBOOK
                        </span>
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
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
                            bg-gray-900/50 backdrop-blur-sm border border-gray-700 
                            rounded-full text-sm text-white placeholder-gray-500
                            focus:outline-none focus:ring-2 focus:ring-red-600
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
                                        ? "text-white bg-white/10"
                                        : "text-gray-300 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {link.name}
                                {isActive(link.path) && (
                                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full"></span>
                                )}
                            </Link>
                        ))}
                    </nav>
                    
                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {!user && (
                            <Link
                                to="/login"
                                className="px-5 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 transition-all duration-300"
                            >
                                Login
                            </Link>
                        )}
                        {user && (
                            <Link to="/user-detail">
                                <div className="relative w-10 h-10 flex items-center justify-center
                                    bg-red-600 text-white font-bold rounded-full
                                    hover:scale-105 transition-all duration-300 cursor-pointer">
                                    <span className="relative z-10">{firstLetter}</span>
                                    <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></span>
                                </div>
                            </Link>
                        )}
                        
                        {/* Hamburger */}
                        <button
                            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-full bg-gray-900/50 backdrop-blur-sm border border-gray-700 hover:bg-gray-800 transition-all duration-300"
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
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="py-4 space-y-1 bg-gray-900/90 backdrop-blur-md rounded-2xl border border-gray-800 mb-4">
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
                                    bg-gray-800/50 border border-gray-700 
                                    rounded-full text-sm text-white placeholder-gray-500
                                    focus:outline-none focus:ring-2 focus:ring-red-600"
                                />
                            </div>
                        </form>
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                to={link.path}
                                className={`block px-4 py-3 text-sm font-medium transition-all duration-300 ${
                                    isActive(link.path)
                                        ? "text-white bg-gray-800 border-l-4 border-red-600"
                                        : "text-gray-300 hover:text-white hover:bg-gray-800/50 hover:border-l-4 hover:border-gray-700"
                                }`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user && (
                            <div className="px-4 py-3 mt-2 border-t border-gray-800">
                                <p className="text-xs text-gray-500">Signed in as</p>
                                <p className="text-sm font-medium text-white">
                                    {user.Name || user.Email}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;