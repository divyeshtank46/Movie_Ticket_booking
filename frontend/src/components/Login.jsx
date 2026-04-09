import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser } from "../services/Authservice";

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setuser } = useAuth();
    useEffect(() => {
        if (location.state?.message) {
            toast.error(location.state.message, {
                toastId: "login-first"
            });
        }
    }, [location.state])
    const formik = useFormik({
        initialValues: {
            Email: "",
            Password: "",
        },

        validationSchema: Yup.object({
            Email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            Password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),

        onSubmit: async (values, { setSubmitting }) => {
            try {
                const data = await loginUser(values);
                // localStorage.setItem("token", data.token);
                setuser(data.user);
                setTimeout(() => {
                    if (data.user.Role === 'Admin') {
                        toast.success(`Welcome ${data.user.Name}`);
                        navigate("/admin", { replace: true });
                    } else {
                        toast.success("Login Successfull");
                        navigate('/');
                    }
                }, 100);
            } catch (error) {
                const message = error.response?.data?.message || "Login Failed";
                toast.error(message);
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 relative overflow-hidden">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-red-600/10 via-purple-600/10 to-blue-600/10 animate-gradient-x"></div>

            {/* Decorative Film Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 via-purple-500 to-blue-500"></div>

            {/* Background Movie Icons */}
            <div className="absolute top-20 left-10 text-6xl opacity-5 animate-pulse">🎬</div>
            <div className="absolute bottom-20 right-10 text-6xl opacity-5 animate-pulse">🎥</div>
            <div className="absolute top-40 right-20 text-4xl opacity-5 rotate-12">🍿</div>

            {/* Main Container */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                {/* Glass Card Container */}
                <div className="w-full max-w-md">
                    {/* Decorative Top Bar */}
                    <div className="mb-6 text-center">
                        <Link to="/" className="inline-block group">
                            <span className="text-3xl font-bold bg-linear-to-r from-red-500 via-purple-500 to-blue-500 
                                bg-clip-text text-transparent animate-gradient">
                                CINEBOOK
                            </span>
                            <span className="ml-1 text-3xl">🎬</span>
                        </Link>
                    </div>

                    {/* Login Form Card with Glass Effect */}
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl 
                        border border-white/10 shadow-2xl
                        transform transition-all duration-500
                        hover:shadow-2xl hover:shadow-red-500/10">

                        {/* Card Header with Gradient */}
                        <div className="px-8 pt-8 pb-4">
                            <h2 className="text-3xl font-bold text-center 
                                bg-linear-to-r from-red-500 to-purple-500 
                                bg-clip-text text-transparent">
                                Welcome Back
                            </h2>
                            <p className="text-gray-400 text-center text-sm mt-2">
                                Sign in to continue your cinema experience
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={formik.handleSubmit} className="px-8 pb-8 space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        📧
                                    </span>
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        {...formik.getFieldProps("Email")}
                                        className={`w-full pl-10 pr-4 py-3 
                                            bg-white/10 backdrop-blur-sm
                                            border rounded-xl
                                            text-white placeholder-gray-500
                                            focus:outline-none focus:ring-2
                                            transition-all duration-300
                                            ${formik.touched.Email && formik.errors.Email
                                                ? "border-red-500/50 focus:ring-red-500/50"
                                                : "border-white/20 focus:border-red-500/50 focus:ring-red-500/30"
                                            }`}
                                    />
                                </div>
                                {formik.touched.Email && formik.errors.Email && (
                                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span> {formik.errors.Email}
                                    </p>
                                )}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Password
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        🔒
                                    </span>
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        {...formik.getFieldProps("Password")}
                                        className={`w-full pl-10 pr-4 py-3 
                                            bg-white/10 backdrop-blur-sm
                                            border rounded-xl
                                            text-white placeholder-gray-500
                                            focus:outline-none focus:ring-2
                                            transition-all duration-300
                                            ${formik.touched.Password && formik.errors.Password
                                                ? "border-red-500/50 focus:ring-red-500/50"
                                                : "border-white/20 focus:border-red-500/50 focus:ring-red-500/30"
                                            }`}
                                    />
                                </div>
                                {formik.touched.Password && formik.errors.Password && (
                                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span> {formik.errors.Password}
                                    </p>
                                )}
                            </div>

                            {/* Forgot Password Link */}
                            <div className="text-right">
                                <button
                                    type="button"
                                    className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-300"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={formik.isSubmitting}
                                className="w-full relative overflow-hidden
                                    bg-linear-to-r from-red-600 to-purple-600 
                                    text-white py-3.5 rounded-xl font-semibold text-lg
                                    hover:from-red-700 hover:to-purple-700
                                    transition-all duration-300
                                    transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    group"
                            >
                                <span className="absolute inset-0 bg-white/20 transform 
                                    -translate-x-full group-hover:translate-x-0 
                                    transition-transform duration-500"></span>
                                <span className="relative flex items-center justify-center gap-2">
                                    {formik.isSubmitting ? (
                                        <>
                                            <span className="w-5 h-5 border-2 border-white 
                                                border-t-transparent rounded-full animate-spin"></span>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                                        </>
                                    )}
                                </span>
                            </button>

                            {/* Register Link */}
                            <p className="text-center text-gray-400">
                                New to CINEBOOK?{" "}
                                <Link
                                    to="/register"
                                    className="text-transparent bg-linear-to-r from-red-500 to-purple-500 
                                        bg-clip-text font-semibold hover:from-red-600 hover:to-purple-600
                                        transition-all duration-300"
                                >
                                    Create Account
                                </Link>
                            </p>
                        </form>
                    </div>

                    {/* Footer Note */}
                    <p className="text-center text-xs text-gray-600 mt-6">
                        By signing in, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>

            {/* Add animations */}
            <style jsx>{`
                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                .animate-gradient {
                    background-size: 200% auto;
                    animation: gradient 3s ease infinite;
                }
                .animate-gradient-x {
                    background-size: 200% auto;
                    animation: gradient-x 3s ease infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;