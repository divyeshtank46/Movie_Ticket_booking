import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { registerUser } from "../services/Authservice";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useAuth } from "../context/Authcontext";

const Registration = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setuser } = useAuth();

    useEffect(() => {
        if (location.state?.message) {
            toast.error(location.state.message, {
                toastId: "register-first"
            });
        }
    }, [location.state]);

    const formik = useFormik({
        initialValues: {
            Name: "",
            Email: "",
            Password: "",
        },

        validationSchema: Yup.object({
            Name: Yup.string()
                .min(2, "Name must be at least 2 characters")
                .required("Name is required"),
            Email: Yup.string()
                .email("Invalid email")
                .required("Email is required"),
            Password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),

        onSubmit: async (values, { setSubmitting, resetForm }) => {
            try {
                const data = await registerUser(values);
                setuser(data.user);
                setTimeout(() => {
                    if (data.user.Role === 'Admin') {
                        toast.success(`Welcome ${data.user.Name}`);
                        navigate("/admin", { replace: true });
                    } else {
                        toast.success("Registration Successful ✅");
                        navigate('/');
                    }
                }, 100);
                resetForm();
            } catch (error) {
                const message = error.response?.data?.message || "Registration Failed ❌";
                toast.error(message);
            } finally {
                setSubmitting(false);
            }
        }
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
            setuser(userData.user);

            setTimeout(() => {
                if (userData.user.Role === 'Admin') {
                    toast.success(`Welcome ${userData.user.Name}`);
                    navigate("/admin", { replace: true });
                } else {
                    toast.success("Google Registration Successful ✅");
                    navigate('/');
                }
            }, 100);
        } catch (error) {
            const message = error.response?.data?.message || "Google Registration Failed ❌";
            toast.error(message);
        }
    };

    const handleGoogleLoginError = () => {
        toast.error("Google Registration Failed. Please try again.");
    };

    return (
        <div className="min-h-screen bg-black text-white pt-20 relative overflow-hidden">
            {/* Decorative Film Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

            {/* Background Movie Icons */}
            <div className="absolute top-20 right-10 text-6xl opacity-5">🎬</div>
            <div className="absolute bottom-20 left-10 text-6xl opacity-5">🎥</div>
            <div className="absolute top-40 left-20 text-4xl opacity-5 -rotate-12">🍿</div>
            <div className="absolute bottom-40 right-20 text-5xl opacity-5">🎫</div>

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

                    {/* Registration Form Card */}
                    <div className="bg-gray-900 rounded-2xl border border-gray-800 shadow-2xl
                        transform transition-all duration-500
                        hover:shadow-2xl hover:shadow-red-900/20">

                        {/* Card Header */}
                        <div className="px-8 pt-8 pb-4">
                            <h2 className="text-3xl font-bold text-center text-red-500">
                                Join CINEBOOK
                            </h2>
                            <p className="text-gray-400 text-center text-sm mt-2">
                                Create an account and start your cinema journey
                            </p>
                        </div>

                        {/* Form */}
                        <form onSubmit={formik.handleSubmit} className="px-8 pb-8 space-y-5">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-300">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                        👤
                                    </span>
                                    <input
                                        type="text"
                                        {...formik.getFieldProps("Name")}
                                        placeholder="Enter your full name"
                                        className={`w-full pl-10 pr-4 py-3 
                                            bg-gray-800
                                            border rounded-xl
                                            text-white placeholder-gray-500
                                            focus:outline-none focus:ring-2
                                            transition-all duration-300
                                            ${formik.touched.Name && formik.errors.Name
                                                ? "border-red-600 focus:ring-red-600"
                                                : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
                                            }`}
                                    />
                                </div>
                                {formik.touched.Name && formik.errors.Name && (
                                    <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                        <span>⚠️</span> {formik.errors.Name}
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
                                        📧
                                    </span>
                                    <input
                                        type="email"
                                        {...formik.getFieldProps("Email")}
                                        placeholder="Enter your email"
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
                                        {...formik.getFieldProps("Password")}
                                        placeholder="Create a password"
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

                                {/* Password Strength Indicator */}
                                {formik.values.Password && !formik.errors.Password && (
                                    <div className="mt-2">
                                        <div className="flex gap-1 h-1">
                                            <div className={`flex-1 h-full rounded-l ${formik.values.Password.length >= 6 ? 'bg-green-600' : 'bg-gray-700'
                                                }`}></div>
                                            <div className={`flex-1 h-full ${formik.values.Password.length >= 8 ? 'bg-green-600' : 'bg-gray-700'
                                                }`}></div>
                                            <div className={`flex-1 h-full rounded-r ${/[!@#$%^&*]/.test(formik.values.Password) ? 'bg-green-600' : 'bg-gray-700'
                                                }`}></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Use at least 6 characters with symbols for strong password
                                        </p>
                                    </div>
                                )}
                            </div>

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
                                <div className="w-full">
                                    <GoogleLogin
                                        onSuccess={handleGoogleLoginSuccess}
                                        onError={handleGoogleLoginError}
                                        theme="outline"
                                        size="large"
                                        width="100%"
                                        text="signup_with"
                                        shape="rectangular"
                                        logo_alignment="center"
                                        ux_mode="popup"
                                    />
                                </div>
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start gap-2 mt-4">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    className="mt-1 w-4 h-4 bg-gray-800 border border-gray-700 rounded
                                        focus:ring-red-600 focus:ring-2"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-400">
                                    I agree to the{" "}
                                    <Link to="/terms" className="text-red-400 hover:text-red-300">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link to="/privacy" className="text-red-400 hover:text-red-300">
                                        Privacy Policy
                                    </Link>
                                </label>
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
                                    disabled:opacity-50 disabled:cursor-not-allowed
                                    mt-6"
                            >
                                {formik.isSubmitting ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white 
                                            border-t-transparent rounded-full animate-spin inline-block mr-2"></span>
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Account →"
                                )}
                            </button>

                            {/* Login Link */}
                            <p className="text-center text-gray-400 pt-4">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-red-500 font-semibold hover:text-red-400
                                        transition-all duration-300"
                                >
                                    Sign In
                                </Link>
                            </p>
                        </form>
                    </div>

                    {/* Footer Note */}
                    <p className="text-center text-xs text-gray-600 mt-6">
                        By joining, you agree to receive movie updates and offers from CINEBOOK
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registration;