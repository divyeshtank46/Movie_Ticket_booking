import React from 'react';
import { Link } from 'react-router-dom';
import {
    MdMenu,
    MdKeyboardArrowDown
} from 'react-icons/md';
import { useAuth } from '../../context/Authcontext';

const AdminTopbar = ({ sidebarOpen, setSidebarOpen }) => {

    const [showProfileMenu, setShowProfileMenu] = React.useState(false);
    const [showNotifications, setShowNotifications] = React.useState(false);
    const notifications = [
        { id: 1, message: "New booking received", time: "5 min ago", type: "booking" },
        { id: 2, message: "Show starting in 30 minutes", time: "30 min ago", type: "show" },
        { id: 3, message: "New user registered", time: "1 hour ago", type: "user" },
    ];
    const { user } = useAuth();
    const firstletter =
        user?.Name?.charAt(0)?.toUpperCase() || user?.Email?.charAt(0)?.toUpperCase();
    
    return (
        <div className="fixed top-0 left-0 right-0 h-16 bg-black border-b border-gray-800 z-30">
            <div className="flex items-center justify-between h-full px-4">
                {/* Left Section */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <MdMenu size={24} />
                    </button>

                    {/* Breadcrumb - Optional */}
                    <div className="hidden md:flex items-center gap-2 text-sm">
                        <Link to="/admin" className="text-gray-400 hover:text-white transition-colors">
                            Dashboard
                        </Link>
                        <span className="text-gray-600">/</span>
                        <span className="text-white">Current Page</span>
                    </div>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                    {/* Admin Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-3 ml-2 pl-2 border-l border-gray-800
                                hover:bg-gray-900 p-2 rounded-lg transition-colors"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-medium text-white">{user?.Name}</p>
                                <p className="text-xs text-gray-400">Super Admin</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-red-600 
                                flex items-center justify-center font-bold shrink-0 text-white">
                                {firstletter}
                            </div>
                            <MdKeyboardArrowDown className="text-gray-400 hidden sm:block" />
                        </button>

                        {/* Profile Dropdown */}
                        {showProfileMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowProfileMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-black 
                                    border border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                                    <div className="p-3 border-b border-gray-800">
                                        <p className="text-sm font-medium text-white">{user?.Name}</p>
                                        <p className="text-xs text-gray-400">{user?.Email}</p>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminTopbar;