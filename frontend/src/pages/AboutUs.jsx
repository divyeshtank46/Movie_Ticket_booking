import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import '../styles/index.css'
import image1 from '../assets/image_5.jpg'
import image2 from '../assets/image_6.jpg'
import image3 from '../assets/image_7.jpg'
const AboutUs = () => {
    const stats = [
        { label: "Movies", value: "21+" },
        { label: "Cinemas", value: "5" },
        { label: "Daily Shows", value: "525+" },
        { label: "Happy Customers", value: "50K+" }
    ];

    const features = [
        {
            icon: "🎬",
            title: "Wide Movie Selection",
            description: "From Bollywood blockbusters to Hollywood hits, we bring you the latest movies across multiple languages."
        },
        {
            icon: "🏢",
            title: "Multiple Cinemas",
            description: "Book tickets at 5 premium cinemas with state-of-the-art screens and comfortable seating."
        },
        {
            icon: "💺",
            title: "Flexible Seating",
            description: "Choose from Silver, Gold, or Platinum seats with varying prices to suit your budget."
        },
        {
            icon: "⏰",
            title: "24/7 Booking",
            description: "Book your tickets anytime, anywhere with our easy-to-use online platform."
        },
        {
            icon: "🎫",
            title: "Easy Cancellation",
            description: "Change of plans? Cancel your booking hassle-free with our simple cancellation policy."
        },
        {
            icon: "🌟",
            title: "Best Prices",
            description: "Get the best ticket prices with exclusive deals and discounts on select shows."
        }
    ];

    const team = [
        {
            name: "Rajesh Kumar",
            role: "Founder & CEO",
            image: image1,
            bio: "Movie enthusiast with 15+ years in cinema exhibition industry."
        },
        {
            name: "Priya Sharma",
            role: "Operations Head",
            image: image3,
            bio: "Ensuring smooth operations across all our cinema partners."
        },
        {
            name: "Amit Patel",
            role: "Technical Director",
            image: image2,
            bio: "Building seamless booking experience with cutting-edge technology."
        }
    ];

    const fadeInUp = {
        initial: { opacity: 0, y: 60 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white pt-20 relative overflow-hidden">
            {/* Animated Background Gradient */}
            <div className="absolute inset-0 bg-linear-to-r from-red-600/10 via-purple-600/10 to-blue-600/10 animate-gradient-x"></div>

            {/* Decorative Film Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-red-500 via-purple-500 to-blue-500"></div>

            {/* Background Icons */}
            <div className="absolute top-20 left-10 text-6xl opacity-5 animate-pulse">🎬</div>
            <div className="absolute bottom-20 right-10 text-6xl opacity-5 animate-pulse">🎥</div>
            <div className="absolute top-1/2 left-1/4 text-6xl opacity-5 animate-pulse">🍿</div>
            <div className="absolute bottom-1/3 right-1/4 text-6xl opacity-5 animate-pulse">🎟️</div>

            {/* Hero Section */}
            <motion.div
                initial="initial"
                animate="animate"
                variants={staggerContainer}
                className="relative z-10"
            >
                <div className="relative bg-black/40 backdrop-blur-xl border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <motion.h1
                            variants={fadeInUp}
                            className="text-5xl md:text-7xl font-bold text-center mb-6 
                                bg-linear-to-r from-red-500 via-purple-500 to-blue-500 
                                bg-clip-text text-transparent animate-gradient"
                        >
                            ABOUT US
                        </motion.h1>
                        <motion.p
                            variants={fadeInUp}
                            className="text-gray-400 text-center text-lg max-w-3xl mx-auto leading-relaxed"
                        >
                            Welcome to <span className="text-red-500 font-semibold">MovieTicket</span> – your ultimate destination for seamless movie ticket booking.
                            We're passionate about bringing the magic of cinema to your fingertips.
                        </motion.p>
                        <motion.div
                            variants={fadeInUp}
                            className="w-24 h-1 bg-linear-to-r from-red-500 to-blue-500 mx-auto mt-8"
                        ></motion.div>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        variants={fadeInUp}
                        className="grid grid-cols-2 md:grid-cols-4 gap-6"
                    >
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 
                                    rounded-2xl p-6 text-center
                                    hover:border-red-500/50 hover:bg-red-500/5
                                    transition-all duration-300"
                            >
                                <div className="text-3xl font-bold bg-linear-to-r 
                                    from-red-500 to-purple-500 bg-clip-text text-transparent">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-sm mt-2">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Our Story Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">
                                <span className="bg-linear-to-r from-red-500 to-purple-500 
                                    bg-clip-text text-transparent">
                                    Our Story
                                </span>
                            </h2>
                            <div className="space-y-4 text-gray-400 leading-relaxed">
                                <p>
                                    Founded in 2024, MovieTicket started with a simple vision: to make movie ticket booking
                                    as enjoyable as watching the movie itself. What began as a small platform has now grown
                                    into a trusted name in cinema ticketing.
                                </p>
                                <p>
                                    We partner with 5 premium cinemas across the city, bringing you 525+ shows daily.
                                    From the latest blockbusters to independent films, we ensure you never miss a
                                    cinematic experience.
                                </p>
                                <p>
                                    Our commitment to innovation and customer satisfaction has made us the preferred
                                    choice for movie lovers. With features like seat selection, multiple pricing tiers,
                                    and easy cancellations, we're revolutionizing how you book movie tickets.
                                </p>
                            </div>

                            {/* Mission/Vision Cards */}
                            <div className="grid grid-cols-2 gap-4 mt-8">
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 
                                    rounded-xl p-4">
                                    <span className="text-3xl mb-2 block">🎯</span>
                                    <h3 className="font-semibold text-white mb-1">Our Mission</h3>
                                    <p className="text-xs text-gray-400">
                                        To provide seamless, secure, and enjoyable ticket booking experience.
                                    </p>
                                </div>
                                <div className="bg-white/5 backdrop-blur-sm border border-white/10 
                                    rounded-xl p-4">
                                    <span className="text-3xl mb-2 block">👁️</span>
                                    <h3 className="font-semibold text-white mb-1">Our Vision</h3>
                                    <p className="text-xs text-gray-400">
                                        To be the most loved movie ticketing platform in every city.
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="relative group">
                                <img
                                    src="https://ik.imagekit.io/c6x5kvy0f/Movie_Cinema/cinema-interior.jpg?updatedAt=1773291361498"
                                    alt="Cinema Interior"
                                    className="rounded-2xl shadow-2xl border border-white/20
                                        group-hover:scale-[1.02] transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-linear-to-t 
                                    from-red-600/20 via-transparent to-transparent 
                                    rounded-2xl"></div>

                                {/* Floating Cards */}
                                <div className="absolute -bottom-6 -left-6 
                                    bg-black/80 backdrop-blur-xl border border-white/20
                                    rounded-xl p-4 shadow-2xl
                                    transform hover:scale-105 transition-transform duration-300">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">🎟️</span>
                                        <div>
                                            <p className="text-sm text-gray-400">Tickets Booked</p>
                                            <p className="text-xl font-bold text-white">500K+</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="absolute -top-6 -right-6 
                                    bg-black/80 backdrop-blur-xl border border-white/20
                                    rounded-xl p-4 shadow-2xl
                                    transform hover:scale-105 transition-transform duration-300">
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl">⭐</span>
                                        <div>
                                            <p className="text-sm text-gray-400">Customer Rating</p>
                                            <p className="text-xl font-bold text-white">4.8/5</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="bg-linear-to-r from-red-500 to-purple-500 
                                bg-clip-text text-transparent">
                                Why Choose Us
                            </span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            We combine technology with passion to give you the best movie booking experience
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -10 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 
                                    rounded-2xl p-8
                                    hover:border-red-500/50 hover:bg-red-500/5
                                    transition-all duration-300 group"
                            >
                                <div className="text-5xl mb-4 transform group-hover:scale-110 
                                    transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* Team Section */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            <span className="bg-linear-to-r from-red-500 to-purple-500 
                                bg-clip-text text-transparent">
                                Meet Our Team
                            </span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            The passionate people behind your favorite movie booking platform
                        </p>
                    </motion.div>

                    <motion.div
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {team.map((member, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                whileHover={{ y: -10 }}
                                className="bg-white/5 backdrop-blur-sm border border-white/10 
                                    rounded-2xl overflow-hidden
                                    hover:border-red-500/50 hover:bg-red-500/5
                                    transition-all duration-300 group"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover 
                                            group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.src = "https://via.placeholder.com/300x400?text=Team+Member";
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t 
                                        from-black via-transparent to-transparent 
                                        opacity-60"></div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-1">
                                        {member.name}
                                    </h3>
                                    <p className="text-red-400 text-sm mb-3">
                                        {member.role}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {member.bio}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
                >
                    <div className="bg-linear-to-r from-red-600/20 to-purple-600/20 
                        backdrop-blur-sm border border-white/10 rounded-3xl p-12 
                        text-center relative overflow-hidden">

                        {/* Background Decorations */}
                        <div className="absolute top-0 left-0 w-32 h-32 
                            bg-red-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 right-0 w-32 h-32 
                            bg-purple-500/20 rounded-full blur-3xl"></div>

                        <h2 className="text-3xl md:text-4xl font-bold mb-4 relative z-10">
                            <span className="bg-linear-to-r from-red-500 to-purple-500 
                                bg-clip-text text-transparent">
                                Ready for a Movie?
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto relative z-10">
                            Join thousands of movie lovers who book with us every day.
                            Experience the magic of cinema like never before.
                        </p>
                        <Link
                            to="/movies"
                            className="inline-block bg-linear-to-r from-red-600 to-purple-600 
                                text-white px-8 py-4 rounded-xl font-semibold text-lg
                                hover:from-red-700 hover:to-purple-700
                                transition-all duration-300
                                transform hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/30
                                relative overflow-hidden group"
                        >
                            <span className="absolute inset-0 bg-white/20 transform 
                                -translate-x-full group-hover:translate-x-0 
                                transition-transform duration-500"></span>
                            <span className="relative flex items-center justify-center gap-2">
                                Book Tickets Now
                                <span className="text-xl group-hover:translate-x-1 transition-transform">→</span>
                            </span>
                        </Link>
                    </div>
                </motion.div>

                {/* Footer Note */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <p className="text-center text-gray-500 text-sm">
                        © 2024 MovieTicket. All rights reserved. | Made with ❤️ for movie lovers
                    </p>
                </div>
            </motion.div>

            {/* Animations */}
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

export default AboutUs;