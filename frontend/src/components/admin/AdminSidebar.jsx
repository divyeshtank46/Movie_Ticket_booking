import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    MdDashboard,
    MdMovie,
    MdTheaters,
    MdConfirmationNumber,
    MdPeople,
    MdSettings,
    MdLogout,
    MdMenu,
    MdClose,
    MdHome
} from 'react-icons/md';
import { BsFillCalendarEventFill } from 'react-icons/bs';
import { useAuth } from '../../context/Authcontext';

const AdminSidebar = ({ sidebarOpen, setSidebarOpen }) => {
    const location = useLocation();
    const { handleLogout } = useAuth();
    const menuItems = [
        { path: "/admin", icon: <MdDashboard />, label: "Dashboard" },
        { path: "/admin/movies", icon: <MdMovie />, label: "Movies" },
        { path: "/admin/cinemas", icon: <MdTheaters />, label: "Cinemas" },
        { path: "/admin/shows", icon: <BsFillCalendarEventFill />, label: "Shows" },
        { path: "/admin/bookings", icon: <MdConfirmationNumber />, label: "Bookings" },
        { path: "/admin/users", icon: <MdPeople />, label: "Users" },
        { path: "/", icon: <MdHome /> , label: "Home" }
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed left-0 top-0 h-full bg-black border-r border-gray-800 transition-all duration-300 z-50
                ${sidebarOpen ? 'w-64' : 'w-20'}
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            `}>

                {/* Logo Area */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
                    <Link to="/admin" className="flex items-center gap-2 overflow-hidden">
                        <span className="text-2xl shrink-0">🎬</span>
                        {sidebarOpen && (
                            <span className="text-xl font-bold text-red-500 whitespace-nowrap">
                                Admin Panel
                            </span>
                        )}
                    </Link>

                    {/* Close Button for Mobile */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden p-1 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <MdClose size={20} />
                    </button>
                </div>

                {/* Menu Items */}
                <div className="h-[calc(100vh-4rem)] overflow-y-auto scrollbar-hide py-6">
                    <div className="space-y-1 px-3">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl
                                    transition-all duration-300 group relative
                                    ${location.pathname === item.path
                                        ? 'bg-red-900/30 text-white border border-red-800'
                                        : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                                    }`}
                            >
                                <span className="text-xl shrink-0">{item.icon}</span>
                                {sidebarOpen && (
                                    <span className="text-sm font-medium truncate">{item.label}</span>
                                )}
                                {!sidebarOpen && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-black 
                                        border border-gray-700 rounded-lg text-sm
                                        whitespace-nowrap opacity-0 invisible group-hover:opacity-100 
                                        group-hover:visible transition-all duration-300 z-50 text-white">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Logout Button */}
                    <div className="absolute bottom-6 left-0 right-0 px-3">
                        <button
                            onClick={handleLogout}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl w-full
                                text-gray-400 hover:bg-red-900/50 hover:text-red-400
                                transition-all duration-300 ${!sidebarOpen && 'justify-center'}`}
                        >
                            <MdLogout className="text-xl shrink-0" />
                            {sidebarOpen && <span className="text-sm font-medium truncate">Logout</span>}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminSidebar;