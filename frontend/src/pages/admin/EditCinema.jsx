import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addCinema, editCinemaById, getCinemaById } from "../../services/Cinemaservice";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const EditCinema = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const cinemaSchema = Yup.object({
        name: Yup.string()
            .required("Cinema name is required")
            .min(2, "Name must be at least 2 characters"),
        city: Yup.string().required("City is required"),
        address: Yup.string().required("Address is required"),
        contactNumber: Yup.string()
            .required("Contact number is required")
            .matches(/^[0-9]{10}$/, "Invalid phone number"),
        totalScreens: Yup.number()
            .required("Number of screens is required")
            .positive("Must be positive")
            .integer("Must be a whole number"),
        facilities: Yup.string().required("Facilities are required"),
        status: Yup.string().required("Status is required"),

    });

    const formik = useFormik({
        initialValues: {
            name: "",
            city: "",
            address: "",
            contactNumber: "",
            totalScreens: "",
            facilities: "",
            status: "Active",
        },
        validationSchema: cinemaSchema,
        onSubmit: async (values) => {
            try {
                const payload = {
                    Name: values.name,
                    City: values.city,
                    Address: values.address,
                    ContactNumber: values.contactNumber,
                    TotalScreens: values.totalScreens,
                    Facilities: values.facilities.split(",").map(f => f.trim()),
                    Status: values.status
                };

                await editCinemaById(id, payload);

                toast.success("Cinema Updated Successfully");
                navigate('/admin/cinemas');

            } catch (err) {
                toast.error(err.message || "Failed To Update Cinema");
            }
        }
    });
    
    useEffect(() => {
        const fetchCinema = async () => {
            try {
                const res = await getCinemaById(id);
                const cinema = res.data;

                formik.setValues({
                    name: cinema.Name || "",
                    city: cinema.City || "",
                    address: cinema.Address || "",
                    contactNumber: cinema.ContactNumber || "",
                    facilities: cinema.Facilities?.join(", ") || "",
                    status: cinema.Status || "Active",
                    totalScreens: cinema.TotalScreens || ""
                })
            } catch (error) {
                toast.error("Failed To Fill Data");
                console.log(error);
            }

        };
        if (id) fetchCinema();
    }, [id])

    return (
        <div className="min-h-screen bg-black text-white pt-20 px-4 sm:px-6 lg:px-8">
            {/* Main Container */}
            <div className="max-w-4xl mx-auto py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Update Cinema
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Fill in the details below to update cinema partner
                    </p>
                    <div className="w-24 h-0.5 bg-gray-800 mx-auto mt-6"></div>
                </div>

                {/* Form Card */}
                <div className="bg-gray-900 rounded-3xl 
                    border border-gray-800 shadow-2xl overflow-hidden">

                    <div className="p-6 sm:p-8">
                        <form onSubmit={formik.handleSubmit} className="space-y-6">
                            {/* Cinema Name */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Cinema Name <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        🏢
                                    </span>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Enter cinema name"
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full pl-10 pr-4 py-3 
                                            bg-gray-800
                                            border rounded-xl
                                            text-white placeholder-gray-500
                                            focus:outline-none focus:ring-2
                                            transition-all duration-300
                                            ${formik.touched.name && formik.errors.name
                                                ? "border-red-600 focus:ring-red-600"
                                                : "border-gray-700 focus:border-gray-600 focus:ring-gray-600/50"
                                            }`}
                                    />
                                </div>
                                {formik.touched.name && formik.errors.name && (
                                    <p className="text-red-400 text-sm mt-1">{formik.errors.name}</p>
                                )}
                            </div>

                            {/* Two Column Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* City */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        City <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            🏙️
                                        </span>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="Enter city"
                                            value={formik.values.city}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full pl-10 pr-4 py-3 
                                                bg-gray-800
                                                border rounded-xl
                                                text-white placeholder-gray-500
                                                focus:outline-none focus:ring-2
                                                transition-all duration-300
                                                ${formik.touched.city && formik.errors.city
                                                    ? "border-red-600 focus:ring-red-600"
                                                    : "border-gray-700 focus:border-gray-600 focus:ring-gray-600/50"
                                                }`}
                                        />
                                    </div>
                                    {formik.touched.city && formik.errors.city && (
                                        <p className="text-red-400 text-sm">{formik.errors.city}</p>
                                    )}
                                </div>

                                {/* Contact Number */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Contact Number <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            📞
                                        </span>
                                        <input
                                            type="tel"
                                            name="contactNumber"
                                            placeholder="10 digit mobile number"
                                            value={formik.values.contactNumber}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full pl-10 pr-4 py-3 
                                                bg-gray-800
                                                border rounded-xl
                                                text-white placeholder-gray-500
                                                focus:outline-none focus:ring-2
                                                transition-all duration-300
                                                ${formik.touched.contactNumber && formik.errors.contactNumber
                                                    ? "border-red-600 focus:ring-red-600"
                                                    : "border-gray-700 focus:border-gray-600 focus:ring-gray-600/50"
                                                }`}
                                        />
                                    </div>
                                    {formik.touched.contactNumber && formik.errors.contactNumber && (
                                        <p className="text-red-400 text-sm">{formik.errors.contactNumber}</p>
                                    )}
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Address <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-500">
                                        📍
                                    </span>
                                    <textarea
                                        name="address"
                                        rows="3"
                                        placeholder="Enter complete address"
                                        value={formik.values.address}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full pl-10 pr-4 py-3 
                                            bg-gray-800
                                            border rounded-xl
                                            text-white placeholder-gray-500
                                            focus:outline-none focus:ring-2
                                            transition-all duration-300 resize-none
                                            ${formik.touched.address && formik.errors.address
                                                ? "border-red-600 focus:ring-red-600"
                                                : "border-gray-700 focus:border-gray-600 focus:ring-gray-600/50"
                                            }`}
                                    />
                                </div>
                                {formik.touched.address && formik.errors.address && (
                                    <p className="text-red-400 text-sm">{formik.errors.address}</p>
                                )}
                            </div>

                            {/* Two Column Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Total Screens */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Total Screens <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            🎬
                                        </span>
                                        <input
                                            type="number"
                                            name="totalScreens"
                                            placeholder="Number of screens"
                                            value={formik.values.totalScreens}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className={`w-full pl-10 pr-4 py-3 
                                                bg-gray-800
                                                border rounded-xl
                                                text-white placeholder-gray-500
                                                focus:outline-none focus:ring-2
                                                transition-all duration-300
                                                ${formik.touched.totalScreens && formik.errors.totalScreens
                                                    ? "border-red-600 focus:ring-red-600"
                                                    : "border-gray-700 focus:border-gray-600 focus:ring-gray-600/50"
                                                }`}
                                        />
                                    </div>
                                    {formik.touched.totalScreens && formik.errors.totalScreens && (
                                        <p className="text-red-400 text-sm">{formik.errors.totalScreens}</p>
                                    )}
                                </div>

                                {/* Status */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Status <span className="text-red-400">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            📍
                                        </span>
                                        <select
                                            name="status"
                                            value={formik.values.status}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            className="w-full pl-10 pr-4 py-3 
                                                bg-gray-800
                                                border border-gray-700 rounded-xl
                                                text-white
                                                focus:outline-none focus:ring-2 focus:ring-gray-600/50
                                                transition-all duration-300
                                                appearance-none cursor-pointer"
                                        >
                                            <option value="Active" className="bg-gray-900">Active</option>
                                            <option value="Inactive" className="bg-gray-900">Inactive</option>
                                        </select>
                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                            <span className="text-gray-400">▼</span>
                                        </div>
                                    </div>
                                    {formik.touched.status && formik.errors.status && (
                                        <p className="text-red-400 text-sm">{formik.errors.status}</p>
                                    )}
                                </div>
                            </div>

                            {/* Facilities */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Facilities (comma separated) <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        ✨
                                    </span>
                                    <input
                                        type="text"
                                        name="facilities"
                                        placeholder="Parking, Food Court, Dolby Atmos, Recliner Seats"
                                        value={formik.values.facilities}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`w-full pl-10 pr-4 py-3 
                                            bg-gray-800
                                            border rounded-xl
                                            text-white placeholder-gray-500
                                            focus:outline-none focus:ring-2
                                            transition-all duration-300
                                            ${formik.touched.facilities && formik.errors.facilities
                                                ? "border-red-600 focus:ring-red-600"
                                                : "border-gray-700 focus:border-gray-600 focus:ring-gray-600/50"
                                            }`}
                                    />
                                </div>
                                {formik.touched.facilities && formik.errors.facilities && (
                                    <p className="text-red-400 text-sm">{formik.errors.facilities}</p>
                                )}
                                <p className="text-xs text-gray-500">Separate multiple facilities with commas</p>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full bg-red-600 
                                    text-white py-3.5 rounded-xl font-semibold text-lg
                                    hover:bg-red-700 transition-all duration-300
                                    transform hover:scale-[1.02]"
                            >
                                Update Cinema
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCinema;