import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { MdSearch, MdFilterList, MdBlock, MdVerifiedUser, MdSwapHoriz } from "react-icons/md";
import { motion } from "framer-motion";
import { getAllUsers, SwitchRole } from "../../services/Admin/getUsers";

const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res);
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Filter users based on search and role
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.Email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = filterRole === "all" || 
                           (filterRole === "Admin" && user.Role === "Admin") ||
                           (filterRole === "User" && user.Role === "User");
        return matchesSearch && matchesRole;
    });

    return (
        <div className="min-h-screen bg-black text-white pt-16 sm:pt-20 px-3 sm:px-4 md:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-red-500">
                        Users Management
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">
                        Manage registered users and their permissions
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
                <div className="flex-1 relative">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-xl
                            text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                            focus:ring-red-600/50 text-sm sm:text-base"
                    />
                </div>

                <div className="flex gap-2">
                    <select
                        value={filterRole}
                        onChange={(e) => setFilterRole(e.target.value)}
                        className="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-900 border border-gray-800 rounded-xl
                            text-white focus:outline-none focus:ring-2 focus:ring-red-600/50 text-sm sm:text-base"
                    >
                        <option value="all">All Roles</option>
                        <option value="user">Users</option>
                        <option value="admin">Admins</option>
                    </select>

                    <button className="p-2 bg-gray-900 border border-gray-800 rounded-xl
                        hover:bg-gray-800 transition-colors">
                        <MdFilterList size={18} className="sm:w-5 sm:h-5" />
                    </button>
                </div>
            </div>

            {/* Users Grid */}
            {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                    <div className="text-5xl sm:text-6xl mb-4 opacity-50">👤</div>
                    <p className="text-gray-400 text-sm sm:text-base">No users found</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {filteredUsers.map((user, index) => (
                        <UserCard key={user._id} user={user} index={index} fetchUsers={fetchUsers} />
                    ))}
                </div>
            )}
        </div>
    );
};

// User Card Component
const UserCard = ({ user, index, fetchUsers }) => {
    const [isSwitching, setIsSwitching] = useState(false);

    const handleSwitchRole = async () => {
        const result = await Swal.fire({
            title: "Are you Switching User's Role?",
            text: `${user.Name} will become ${user.Role === 'Admin' ? 'User' : 'Admin'}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Switch The Role!",
            cancelButtonText: "Cancel",
            background: "#1f2937",
            color: "#ffffff",
            iconColor: "#ef4444",
            customClass: {
                popup: 'rounded-2xl border border-gray-700 bg-gray-900',
                confirmButton: 'bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2',
                cancelButton: 'bg-gray-700 hover:bg-gray-600 rounded-lg px-4 py-2 border border-gray-600'
            }
        });

        if (result.isConfirmed) {
            setIsSwitching(true);
            try {
                await SwitchRole(user._id);
                await fetchUsers();
                toast.success(`Role switched successfully! ${user.Name} is now ${user.Role === 'Admin' ? 'User' : 'Admin'}`);
            } catch (error) {
                toast.error(error.message || "Failed To Switch Role");
            } finally {
                setIsSwitching(false);
            }
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-5 lg:p-6
                hover:border-red-800 transition-all duration-300 group"
        >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3 sm:gap-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 
                        flex items-center justify-center text-base sm:text-xl font-bold text-white">
                        {user.Name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm sm:text-base truncate">{user.Name}</h3>
                        <p className="text-xs text-gray-400 truncate">{user.Email}</p>
                    </div>
                </div>

                {user.Role === 'Admin' ? (
                    <span className="px-2 py-1 bg-purple-900/50 text-purple-400 
                        text-xs rounded-full border border-purple-800 flex items-center gap-1 w-fit">
                        <MdVerifiedUser size={12} />
                        Admin
                    </span>
                ) : (
                    <span className="px-2 py-1 bg-blue-900/50 text-blue-400 
                        text-xs rounded-full border border-blue-800 w-fit">
                        User
                    </span>
                )}
            </div>

            <div className="space-y-2 text-sm mb-4">
                <p className="text-gray-400 flex items-center gap-2 text-xs sm:text-sm">
                    <span>📧</span>
                    <span className="truncate">{user.Email}</span>
                </p>
                <p className="text-gray-400 flex items-center gap-2 text-xs sm:text-sm">
                    <span>📅</span>
                    Joined {new Date(user.createdAt).toLocaleDateString()}
                </p>
            </div>

            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between pt-4 border-t border-gray-800 gap-3 xs:gap-0">
                <span className={`px-2 py-1 text-xs rounded-full border w-fit
                    ${user.status === 'Active'
                        ? 'bg-green-900/50 text-green-400 border-green-800'
                        : 'bg-gray-800 text-gray-400 border-gray-700'}`}>
                    {user.Status || "Active"}
                </span>

                <div className="flex gap-2">
                    {/* Switch Role Button */}
                    <button 
                        onClick={handleSwitchRole}
                        disabled={isSwitching}
                        className="p-1.5 bg-gray-800 border border-gray-700 
                            rounded-lg transition-all duration-300 text-green-400
                            hover:bg-green-900/50 hover:border-green-800 hover:scale-110
                            disabled:opacity-50 disabled:cursor-not-allowed
                            focus:outline-none focus:ring-2 focus:ring-green-600/50
                            relative group"
                        title={`Switch to ${user.Role === 'Admin' ? 'User' : 'Admin'} role`}
                    >
                        {isSwitching ? (
                            <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                <MdSwapHoriz size={10} className="sm:w-4 sm:h-4" />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 
                                    bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap
                                    opacity-0 group-hover:opacity-100 transition-opacity duration-300
                                    border border-gray-700 pointer-events-none z-10 hidden sm:block">
                                    Switch to {user.Role === 'Admin' ? 'User' : 'Admin'}
                                </div>
                            </>
                        )}
                    </button>
                    
                    <button 
                        className="p-1.5 bg-gray-800 border border-gray-700 
                            rounded-lg transition-all duration-300 text-red-400
                            hover:bg-red-900/50 hover:border-red-800 hover:scale-110
                            focus:outline-none focus:ring-2 focus:ring-red-600/50
                            relative group"
                        title="Block User"
                    >
                        <MdBlock size={14} className="sm:w-4 sm:h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default UsersManagement;