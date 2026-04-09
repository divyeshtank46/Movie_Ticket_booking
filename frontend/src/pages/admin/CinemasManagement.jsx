import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MdAdd, MdEdit, MdDelete, MdLocationOn, MdPhone, MdTheaters } from "react-icons/md";
import { deleteCinemaById, getCinemas } from "../../services/Cinemaservice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const CinemasManagement = () => {
    const [cinemas, setCinemas] = useState([]);
    const navigate = useNavigate();

    const handleEdit = (id) => {
        navigate(`/admin/editcinema/${id}`);
    }
    useEffect(() => {
        const fetchCinema = async () => {
            try {
                const data = await getCinemas();
                setCinemas(data);
            } catch (err) {
                console.error("Failed to load cinemas");
            }
        };

        fetchCinema();
    }, []);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-linear-to-r from-red-500 to-purple-500 
                        bg-clip-text text-transparent">
                        Cinemas Management
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">
                        Manage all cinema partners and their details
                    </p>
                </div>

                <button
                    onClick={() => navigate('/admin/addcinema')}
                    className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-linear-to-r 
                    from-red-600 to-purple-600 rounded-xl text-white font-medium
                    hover:from-red-700 hover:to-purple-700 transition-all duration-300
                    transform hover:scale-[1.02]">
                    <MdAdd size={20} />
                    Add New Cinema
                </button>
            </div>

            {/* Cinemas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cinemas.map((cinema, index) => (
                    <CinemaCard
                        key={cinema._id}
                        cinema={cinema}
                        index={index}
                        onEdit={() => handleEdit(cinema._id)}
                    />
                ))}
            </div>
        </div>
    );
};

const CinemaCard = ({ cinema, index, onEdit }) => {
    return (

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden
            hover:border-red-500/50 transition-all duration-300 group"
        >
            <div className="relative h-56 overflow-hidden">
                <img
                    src={cinema.Images?.[0]}
                    alt={cinema.Name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent"></div>

                <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white">{cinema.Name}</h3>
                    <p className="text-sm text-gray-300 flex items-center gap-1">
                        <MdLocationOn className="text-red-400" />
                        {cinema.City}
                    </p>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {/* Address & Contact */}
                <div className="space-y-2 text-sm">
                    <p className="text-gray-400 flex items-start gap-2">
                        <span className="text-red-400 mt-1">📍</span>
                        {cinema.Address}
                    </p>
                    <p className="text-gray-400 flex items-center gap-2">
                        <MdPhone className="text-red-400" />
                        {cinema.ContactNumber}
                    </p>
                </div>

                {/* Screens */}
                <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex items-center gap-2">
                        <MdTheaters className="text-purple-400" />
                        <span className="text-sm">{cinema.TotalScreens} Screens</span>
                    </div>
                </div>

                {/* Facilities */}
                <div>
                    <p className="text-sm text-gray-400 mb-2">Facilities</p>
                    <div className="flex flex-wrap gap-2">
                        {cinema.Facilities?.map((facility, i) => (
                            <span
                                key={i}
                                className="text-xs bg-white/10 px-3 py-1 rounded-full"
                            >
                                {facility}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                    <button
                        onClick={onEdit}
                        className="p-2 hover:bg-blue-500/20 rounded-lg transition-colors
                    text-blue-400 border border-blue-500/30">
                        <MdEdit size={18} />
                    </button>
                    <button
                        onClick={async () => {
                            const result = await Swal.fire({
                                title: "Are you sure?",
                                text: "You won't be able to revert this!",
                                icon: "warning",
                                showCancelButton: true,
                                confirmButtonColor: "#ef4444",
                                cancelButtonColor: "#6b7280",
                                confirmButtonText: "Yes, delete it!",
                                cancelButtonText: "Cancel",
                                background: "#0a0a0f",
                                color: "#ffffff",
                                iconColor: "#ef4444",
                                customClass: {
                                    popup: 'rounded-2xl border border-white/20 backdrop-blur-xl bg-white/5',
                                    confirmButton: 'bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 transition-all',
                                    cancelButton: 'bg-white/10 hover:bg-white/20 rounded-lg px-4 py-2 transition-all border border-white/20'
                                }
                            });
                            if (result.isConfirmed) {
                                try {
                                    const res = await deleteCinemaById(cinema._id);
                                    window.location.reload();

                                }
                                catch (err) {
                                    toast.error(err.message || "Failed To Delete Cinema ")
                                }
                            }
                        }}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors
                    text-red-400 border border-red-500/30">
                        <MdDelete size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    )

}


export default CinemasManagement;