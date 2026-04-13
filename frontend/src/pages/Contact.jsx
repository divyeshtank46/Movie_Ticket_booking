import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { MdEmail, MdMessage, MdSubject } from "react-icons/md";
import { FaFacebookF, FaPhoneAlt, FaUserCircle, FaRegCommentDots, FaInstagram, FaTwitter, FaYoutube, FaArrowRight,FaArrowLeft } from "react-icons/fa";

const ContactUs = () => {
    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            subject: "",
            message: ""
        },

        validationSchema: Yup.object({
            name: Yup.string()
                .min(2, "Name must be at least 2 characters")
                .required("Name is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            subject: Yup.string()
                .min(3, "Subject must be at least 3 characters")
                .required("Subject is required"),
            message: Yup.string()
                .min(10, "Message must be at least 10 characters")
                .required("Message is required")
        }),

        onSubmit: async (values, { resetForm, setSubmitting }) => {
            try {
                // Simulate API delay
                await new Promise((resolve) => setTimeout(resolve, 1000));
                toast.success("Message Sent Successfully ✅");
                resetForm();
            } catch (error) {
                toast.error("Something went wrong ❌");
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="min-h-screen bg-black text-white pt-20 relative overflow-hidden">
            {/* Decorative Film Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

            {/* Background Movie Icons */}
            <div className="absolute top-20 left-10 text-6xl opacity-5">🎬</div>
            <div className="absolute bottom-20 right-10 text-6xl opacity-5">🎥</div>
            <div className="absolute top-40 right-20 text-4xl opacity-5 rotate-12">🍿</div>
            <div className="absolute bottom-40 left-20 text-5xl opacity-5">🎫</div>

            {/* Main Container */}
            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block group mb-6">
                        <span className="text-3xl font-bold text-red-500">
                            CINEBOOK
                        </span>
                        <span className="ml-1 text-3xl">🎬</span>
                    </Link>

                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-red-500">
                        Contact Us
                    </h1>

                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>

                    <div className="w-24 h-0.5 bg-red-600 mx-auto mt-6"></div>
                </div>

                {/* Contact Form Card */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-gray-900 rounded-3xl 
                        border border-gray-800 shadow-2xl overflow-hidden
                        transform transition-all duration-500
                        hover:shadow-2xl hover:shadow-red-900/20">

                        <div className="p-6 sm:p-8">
                            <form onSubmit={formik.handleSubmit} className="space-y-6">
                                {/* Name + Email Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                <FaUserCircle />
                                            </span>
                                            <input
                                                type="text"
                                                name="name"
                                                {...formik.getFieldProps("name")}
                                                placeholder="Your Name"
                                                className={`w-full pl-10 pr-4 py-3 
                                                    bg-gray-800
                                                    border rounded-xl
                                                    text-white placeholder-gray-500
                                                    focus:outline-none focus:ring-2
                                                    transition-all duration-300
                                                    ${formik.touched.name && formik.errors.name
                                                        ? "border-red-600 focus:ring-red-600"
                                                        : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
                                                    }`}
                                            />
                                        </div>
                                        {formik.touched.name && formik.errors.name && (
                                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                <span>⚠️</span> {formik.errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-300">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                                <MdEmail />
                                            </span>
                                            <input
                                                type="email"
                                                name="email"
                                                {...formik.getFieldProps("email")}
                                                placeholder="example@gmail.com"
                                                className={`w-full pl-10 pr-4 py-3 
                                                    bg-gray-800
                                                    border rounded-xl
                                                    text-white placeholder-gray-500
                                                    focus:outline-none focus:ring-2
                                                    transition-all duration-300
                                                    ${formik.touched.email && formik.errors.email
                                                        ? "border-red-600 focus:ring-red-600"
                                                        : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
                                                    }`}
                                            />
                                        </div>
                                        {formik.touched.email && formik.errors.email && (
                                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                <span>⚠️</span> {formik.errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Subject Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Subject
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            <MdSubject />
                                        </span>
                                        <input
                                            type="text"
                                            name="subject"
                                            {...formik.getFieldProps("subject")}
                                            placeholder="How can we help you?"
                                            className={`w-full pl-10 pr-4 py-3 
                                                bg-gray-800
                                                border rounded-xl
                                                text-white placeholder-gray-500
                                                focus:outline-none focus:ring-2
                                                transition-all duration-300
                                                ${formik.touched.subject && formik.errors.subject
                                                    ? "border-red-600 focus:ring-red-600"
                                                    : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
                                                }`}
                                        />
                                    </div>
                                    {formik.touched.subject && formik.errors.subject && (
                                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span> {formik.errors.subject}
                                        </p>
                                    )}
                                </div>

                                {/* Message Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-300">
                                        Message
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-500">
                                            <MdMessage />
                                        </span>
                                        <textarea
                                            name="message"
                                            rows="5"
                                            {...formik.getFieldProps("message")}
                                            placeholder="Write your message here..."
                                            className={`w-full pl-10 pr-4 py-3 
                                                bg-gray-800
                                                border rounded-xl
                                                text-white placeholder-gray-500
                                                focus:outline-none focus:ring-2
                                                transition-all duration-300 resize-none
                                                ${formik.touched.message && formik.errors.message
                                                    ? "border-red-600 focus:ring-red-600"
                                                    : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
                                                }`}
                                        />
                                    </div>
                                    {formik.touched.message && formik.errors.message && (
                                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                            <span>⚠️</span> {formik.errors.message}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={formik.isSubmitting}
                                    className="w-full bg-red-600 
                                        text-white py-3.5 rounded-xl font-semibold text-lg
                                        hover:bg-red-700
                                        transition-all duration-300
                                        hover:scale-[1.02] hover:shadow-lg hover:shadow-red-900/30
                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {formik.isSubmitting ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white 
                                                border-t-transparent rounded-full animate-spin inline-block mr-2"></span>
                                            Sending...
                                        </>
                                    ) : (
                                        `Send Message →`
                                    )}
                                </button>
                            </form>

                            {/* Contact Information */}
                            <div className="mt-8 pt-8 border-t border-gray-800">
                                <h3 className="text-lg font-semibold text-center mb-4 text-red-500">
                                    Get in Touch
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Email Contact */}
                                    <div className="bg-gray-800 rounded-xl p-4 
                                        border border-gray-700 hover:border-red-800 
                                        transition-all duration-300 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg 
                                                bg-red-900/20 
                                                flex items-center justify-center text-xl
                                                group-hover:scale-110 transition-transform duration-300">
                                                <MdEmail />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Email Us</p>
                                                <a href="mailto:support@cinebook.com"
                                                    className="text-sm text-white hover:text-red-400 transition-colors">
                                                    support@cinebook.com
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone Contact */}
                                    <div className="bg-gray-800 rounded-xl p-4 
                                        border border-gray-700 hover:border-red-800 
                                        transition-all duration-300 group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg 
                                                bg-red-900/20 
                                                flex items-center justify-center text-xl
                                                group-hover:scale-110 transition-transform duration-300">
                                                <FaPhoneAlt />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400">Call Us</p>
                                                <a href="tel:+917016357955"
                                                    className="text-sm text-white hover:text-red-400 transition-colors">
                                                    +91 7016357955
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Social Links */}
                                <div className="flex justify-center gap-4 mt-6">
                                    <a href="#" className="w-10 h-10 bg-gray-800 
                                        rounded-full border border-gray-700 flex items-center justify-center
                                        hover:bg-gray-700 hover:scale-110 transition-all duration-300
                                        text-xl">
                                        <FaFacebookF />
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-gray-800 
                                        rounded-full border border-gray-700 flex items-center justify-center
                                        hover:bg-gray-700 hover:scale-110 transition-all duration-300
                                        text-xl">
                                        <FaTwitter />
                                    </a>
                                    <a href="#" className="w-10 h-10 bg-gray-800 
                                        rounded-full border border-gray-700 flex items-center justify-center
                                        hover:bg-gray-700 hover:scale-110 transition-all duration-300
                                        text-xl">
                                        <FaInstagram />
                                    </a>
                                </div>
                            </div>

                            {/* Back to Home */}
                            <p className="text-sm text-center mt-6">
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-2 text-gray-400 
                                        hover:text-red-400 transition-colors duration-300"
                                >
                                    <FaArrowLeft /> Back to Home
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;