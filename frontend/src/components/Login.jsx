import React, { useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { loginUser } from "../services/Authservice";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { setuser, fetchUser, user, isJustLoggedIn } = useAuth();

    useEffect(() => {
        if (location.state?.message) {
            toast.error(location.state.message, {
                toastId: "login-first"
            });
        }
    }, [location.state]);

    // Effect to handle redirect after user is set
    useEffect(() => {
        if (user && isJustLoggedIn?.current) {
            console.log("User detected in Login component:", user);
            
            // Small delay to ensure state is stable
            setTimeout(() => {
                if (user.Role === 'Admin' || user.role === 'Admin') {
                    console.log("Redirecting to admin panel...");
                    navigate("/admin", { replace: true });
                } else if (user.Role === 'User' || user.role === 'User') {
                    console.log("Redirecting to home...");
                    navigate('/', { replace: true });
                }
            }, 100);
        }
    }, [user, navigate, isJustLoggedIn]);

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
                console.log("Login response:", data);
                
                // Update user in context
                setuser(data.user);
                
                // Show success message
                toast.success(`Welcome ${data.user.Name || data.user.name}`);
                
                // No need to navigate here - useEffect will handle it
                
            } catch (error) {
                const message = error.response?.data?.message || "Login Failed";
                toast.error(message);
                setSubmitting(false);
            }
        },
    });

    const handleGoogleLoginSuccess = async (credentialResponse) => {
        try {
            const response = await axios.post("http://localhost:3000/api/auth/google-login",
                {
                    token: credentialResponse.credential
                },
                {
                    withCredentials: true
                }
            );

            const userData = response.data;
            console.log("Google login response:", userData);
            
            // Update user in context
            setuser(userData.user);
            
            // Show success message
            toast.success(`Welcome ${userData.user.Name || userData.user.name}`);
            
            // No need to navigate here - useEffect will handle it
            
        } catch (error) {
            const message = error.response?.data?.message || "Google Login Failed";
            toast.error(message);
        }
    };

    const handleGoogleLoginError = () => {
        toast.error("Google Login Failed. Please try again.");
    };

    return (
        <div className="min-h-screen bg-black text-white pt-20 relative overflow-hidden">
            {/* Decorative Film Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

            {/* Background Movie Icons */}
            <div className="absolute top-20 left-10 text-6xl opacity-5">🎬</div>
            <div className="absolute bottom-20 right-10 text-6xl opacity-5">🎥</div>
            <div className="absolute top-40 right-20 text-4xl opacity-5 rotate-12">🍿</div>

            {/* Main Container */}
            <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                {/* Card Container */}
                <div className="w-full max-w-md">
                    {/* Decorative Top Bar */}
                    <div className="mb-6 text-center">
                        <Link to="/" className="inline-block group">
                            <span className="text-3xl font-bold text-red-500">
                                CINEBOOK
                            </span>
                            <span className="ml-1 text-3xl">🎬</span>
                        </Link>
                    </div>

                    {/* Login Form Card */}
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl
                        transform transition-all duration-500
                        hover:shadow-2xl hover:shadow-red-900/20">

                        {/* Card Header */}
                        <div className="px-8 pt-8 pb-4">
                            <h2 className="text-3xl font-bold text-center text-red-500">
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
                                            bg-gray-800
                                            border rounded-xl
                                            text-white placeholder-gray-500
                                            focus:outline-none focus:ring-2
                                            transition-all duration-300
                                            ${formik.touched.Email && formik.errors.Email
                                                ? "border-red-600 focus:ring-red-600"
                                                : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
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
                                            bg-gray-800
                                            border rounded-xl
                                            text-white placeholder-gray-500
                                            focus:outline-none focus:ring-2
                                            transition-all duration-300
                                            ${formik.touched.Password && formik.errors.Password
                                                ? "border-red-600 focus:ring-red-600"
                                                : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
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
                                    onClick={() => {
                                        toast.info("Password reset feature coming soon!");
                                    }}
                                    className="text-sm text-gray-400 hover:text-red-400 transition-colors duration-300"
                                >
                                    Forgot Password?
                                </button>
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
                                        Signing in...
                                    </>
                                ) : (
                                    "Sign In →"
                                )}
                            </button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-800"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-900 text-gray-400 rounded-full">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            {/* Google Login Button */}
                            <div className="flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleLoginSuccess}
                                    onError={handleGoogleLoginError}
                                    theme="outline"
                                    size="large"
                                    width="100%"
                                    text="signin_with"
                                    shape="rectangular"
                                    logo_alignment="center"
                                />
                            </div>

                            {/* Register Link */}
                            <p className="text-center text-gray-400 pt-4">
                                New to CINEBOOK?{" "}
                                <Link
                                    to="/register"
                                    className="text-red-500 font-semibold hover:text-red-400
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
        </div>
    );
};

export default Login;