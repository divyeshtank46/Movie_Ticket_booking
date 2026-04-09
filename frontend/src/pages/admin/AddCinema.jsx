import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addCinema } from "../../services/Cinemaservice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddCinema = () => {
    const navigate = useNavigate();
    const [imagePreviews, setImagePreviews] = useState([]);

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
        images: Yup.array()
            .min(1, "At least one image is required")
            .test(
                "fileSize",
                "File too large (max 5MB each)",
                (value) => !value || value.every((file) => file.size <= 5 * 1024 * 1024)
            )
            .test(
                "fileType",
                "Only JPG / PNG allowed",
                (value) =>
                    !value ||
                    value.every((file) =>
                        ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
                    )
            ),
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
            images: [],
        },
        validationSchema: cinemaSchema,
        onSubmit: async (values) => {
            try {
                const formData = new FormData();

                // images
                values.images.forEach((image) => {
                    formData.append("Images", image);
                });

                // text fields (match model EXACTLY)
                formData.append("Name", values.name);
                formData.append("City", values.city);
                formData.append("Address", values.address);
                formData.append("ContactNumber", values.contactNumber);
                formData.append("TotalScreens", values.totalScreens);
                formData.append("Status", values.status);

                // Facilities array (IMPORTANT)
                const facilitiesArray = values.facilities
                    .split(",")
                    .map((f) => f.trim());

                facilitiesArray.forEach((f) => {
                    formData.append("Facilities", f);
                });

                const res = await addCinema(formData);

                toast.success(res.message || "Cinema Created Successfully");
                navigate("/admin/cinemas");

            } catch (err) {
                console.log(err);
                toast.error(
                    err.response?.data?.message || "Failed To Create Cinema"
                );
            }
        }
    });

    const handleImageChange = (e) => {
        const files = Array.from(e.currentTarget.files);
        const remaining = 5 - formik.values.images.length;
        const validFiles = files.slice(0, remaining);

        if (validFiles.length === 0) return;

        const newImages = [...formik.values.images, ...validFiles];
        formik.setFieldValue("images", newImages);

        // FIX 2: Mark images as touched so validation errors show immediately
        formik.setFieldTouched("images", true);

        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews((prev) => [...prev, reader.result]);
            };
            reader.readAsDataURL(file);
        });

        // Reset input so same file can be re-selected if removed
        e.target.value = "";
    };

    const removeImage = (index) => {
        const newImages = formik.values.images.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);
        formik.setFieldValue("images", newImages);
        setImagePreviews(newPreviews);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 px-4 sm:px-6 lg:px-8">
            {/* Main Container */}
            <div className="max-w-4xl mx-auto py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Add New Cinema
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Fill in the details below to add a new cinema partner
                    </p>
                    <div className="w-24 h-1 bg-white/20 mx-auto mt-6"></div>
                </div>

                {/* Form Card */}
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <form onSubmit={formik.handleSubmit} className="space-y-6">

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Cinema Images <span className="text-red-400">*</span>
                                    <span className="text-xs text-gray-500 ml-2">(Max 5 images)</span>
                                </label>

                                <div className="flex flex-col gap-4">
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg"
                                            onChange={handleImageChange}
                                            multiple
                                            className="hidden"
                                            id="imageUpload"
                                            // FIX 3: Disable input when max images reached or submitting
                                            disabled={
                                                formik.values.images.length >= 5 ||
                                                formik.isSubmitting
                                            }
                                        />
                                        <label
                                            htmlFor="imageUpload"
                                            className={`flex items-center justify-center gap-2
                                                    w-full px-4 py-3 
                                                    bg-white/10 backdrop-blur-sm
                                                    border-2 border-dashed border-white/30 
                                                    rounded-xl
                                                    transition-all duration-300
                                                    ${formik.values.images.length >= 5 || formik.isSubmitting
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "cursor-pointer hover:bg-white/20 hover:border-white/50"
                                                }`}
                                        >
                                            <span className="text-2xl">📸</span>
                                            <span>
                                                {formik.values.images.length >= 5
                                                    ? "Maximum images reached"
                                                    : `Select Images from Storage (${formik.values.images.length}/5)`}
                                            </span>
                                        </label>
                                    </div>

                                    {/* Image Previews */}
                                    {imagePreviews.length > 0 && (
                                        <div className="flex flex-wrap gap-3">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-20 h-20 object-cover rounded-lg border border-white/20"
                                                    />
                                                    {/* FIX 4: Disable remove button while submitting */}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        disabled={formik.isSubmitting}
                                                        className="absolute -top-2 -right-2 w-5 h-5 
                                                                bg-white/20 backdrop-blur-sm rounded-full 
                                                                flex items-center justify-center
                                                                text-white text-xs hover:bg-white/40 transition
                                                                opacity-0 group-hover:opacity-100
                                                                disabled:cursor-not-allowed"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {formik.touched.images && formik.errors.images && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                                        <span>⚠️</span> {formik.errors.images}
                                    </p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Supported formats: JPG, PNG (Max 5MB each)
                                </p>
                            </div>

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
                                        disabled={formik.isSubmitting}
                                        className={`w-full pl-10 pr-4 py-3 
                                                bg-white/10 backdrop-blur-sm
                                                border rounded-xl
                                                text-white placeholder-gray-500
                                                focus:outline-none focus:ring-2
                                                transition-all duration-300
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                ${formik.touched.name && formik.errors.name
                                                ? "border-red-500/50 focus:ring-red-500/50"
                                                : "border-white/20 focus:border-white/40 focus:ring-white/30"
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
                                            disabled={formik.isSubmitting}
                                            className={`w-full pl-10 pr-4 py-3 
                                                    bg-white/10 backdrop-blur-sm
                                                    border rounded-xl
                                                    text-white placeholder-gray-500
                                                    focus:outline-none focus:ring-2
                                                    transition-all duration-300
                                                    disabled:opacity-50 disabled:cursor-not-allowed
                                                    ${formik.touched.city && formik.errors.city
                                                    ? "border-red-500/50 focus:ring-red-500/50"
                                                    : "border-white/20 focus:border-white/40 focus:ring-white/30"
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
                                            disabled={formik.isSubmitting}
                                            className={`w-full pl-10 pr-4 py-3 
                                                    bg-white/10 backdrop-blur-sm
                                                    border rounded-xl
                                                    text-white placeholder-gray-500
                                                    focus:outline-none focus:ring-2
                                                    transition-all duration-300
                                                    disabled:opacity-50 disabled:cursor-not-allowed
                                                    ${formik.touched.contactNumber && formik.errors.contactNumber
                                                    ? "border-red-500/50 focus:ring-red-500/50"
                                                    : "border-white/20 focus:border-white/40 focus:ring-white/30"
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
                                        disabled={formik.isSubmitting}
                                        className={`w-full pl-10 pr-4 py-3 
                                                bg-white/10 backdrop-blur-sm
                                                border rounded-xl
                                                text-white placeholder-gray-500
                                                focus:outline-none focus:ring-2
                                                transition-all duration-300 resize-none
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                ${formik.touched.address && formik.errors.address
                                                ? "border-red-500/50 focus:ring-red-500/50"
                                                : "border-white/20 focus:border-white/40 focus:ring-white/30"
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
                                            disabled={formik.isSubmitting}
                                            className={`w-full pl-10 pr-4 py-3 
                                                    bg-white/10 backdrop-blur-sm
                                                    border rounded-xl
                                                    text-white placeholder-gray-500
                                                    focus:outline-none focus:ring-2
                                                    transition-all duration-300
                                                    disabled:opacity-50 disabled:cursor-not-allowed
                                                    ${formik.touched.totalScreens && formik.errors.totalScreens
                                                    ? "border-red-500/50 focus:ring-red-500/50"
                                                    : "border-white/20 focus:border-white/40 focus:ring-white/30"
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
                                            disabled={formik.isSubmitting}
                                            className="w-full pl-10 pr-4 py-3 
                                                    bg-white/10 backdrop-blur-sm
                                                    border border-white/20 rounded-xl
                                                    text-white
                                                    focus:outline-none focus:ring-2 focus:ring-white/30
                                                    transition-all duration-300
                                                    appearance-none cursor-pointer
                                                    disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        disabled={formik.isSubmitting}
                                        className={`w-full pl-10 pr-4 py-3 
                                                bg-white/10 backdrop-blur-sm
                                                border rounded-xl
                                                text-white placeholder-gray-500
                                                focus:outline-none focus:ring-2
                                                transition-all duration-300
                                                disabled:opacity-50 disabled:cursor-not-allowed
                                                ${formik.touched.facilities && formik.errors.facilities
                                                ? "border-red-500/50 focus:ring-red-500/50"
                                                : "border-white/20 focus:border-white/40 focus:ring-white/30"
                                            }`}
                                    />
                                </div>
                                {formik.touched.facilities && formik.errors.facilities && (
                                    <p className="text-red-400 text-sm">{formik.errors.facilities}</p>
                                )}
                                <p className="text-xs text-gray-500">Separate multiple facilities with commas</p>
                            </div>

                            {/* FIX 5: Submit Button with loading state */}
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full bg-white/10 backdrop-blur-sm 
                                        border border-white/20 text-white py-3.5 rounded-xl font-semibold text-lg
                                        hover:bg-white/20 transition-all duration-300
                                        transform hover:scale-[1.02]
                                        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-white/10
                                        flex items-center justify-center gap-2"
                            >
                                {formik.isSubmitting ? (
                                    <>
                                        <svg
                                            className="animate-spin h-5 w-5 text-white"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v8z"
                                            />
                                        </svg>
                                        Adding Cinema...
                                    </>
                                ) : (
                                    "Add Cinema"
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCinema;