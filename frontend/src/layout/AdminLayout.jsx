import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminTopbar from '../components/admin/AdminTopbar';
import '../styles/admin.css';
import { useAuth } from '../context/Authcontext';

const AdminLayout = () => {

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user || user.Role !== 'Admin') {
            navigate('/');
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            <div className="fixed inset-0 bg-linear-to-r from-red-600/5 via-purple-600/5 to-blue-600/5 animate-gradient-x pointer-events-none"></div>
            <AdminTopbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
            <div className={`pt-16 transition-all duration-300 
                ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}
                ml-0`}>
                <div className="p-4 md:p-6 relative z-10">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;