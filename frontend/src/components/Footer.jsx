import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/Footer.css'
import { toast } from "react-toastify";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: "Cinemas", path: "/cinemas" },
    { name: "My Bookings", path: "/bookings" }
  ];

  const supportLinks = [
    { name: "Contact", path: "/contact-us" },
    { name: "About", path: "/about" },
    { name: "Privacy Policy", path: "/privacy-policy" },
    { name: "Terms", path: "/terms" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: <FaFacebookF />, url: "https://facebook.com" },
    { name: "Twitter", icon: <FaTwitter />, url: "https://twitter.com" },
    { name: "Instagram", icon: <FaInstagram />, url: "https://instagram.com" },
    { name: "YouTube", icon: <FaYoutube />, url: "https://youtube.com" }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    toast.success("Successfully subscribed to CINEBOOK! 🎬");
    setEmail("");
  };

  return (
    <footer className="relative bg-black text-white mt-20 overflow-hidden">
      {/* Decorative film strip effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

      {/* Main Footer */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-16">

          {/* Column 1 - Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="inline-block group">
              <span className="text-3xl font-bold text-red-500">
                CINEBOOK
              </span>
              <span className="ml-1 text-3xl">🎬</span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed max-w-md">
              Experience cinema like never before with CINEBOOK.
              Book your favorite movies, reserve the best seats,
              and enjoy exclusive offers.
            </p>

            {/* Stats cards */}
            <div className="flex gap-4 pt-4">
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex-1">
                <p className="text-2xl font-bold text-white">100+</p>
                <p className="text-xs text-gray-400">Screens</p>
              </div>
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 flex-1">
                <p className="text-2xl font-bold text-white">50k+</p>
                <p className="text-xs text-gray-400">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* Column 2 - Quick Links */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-1 h-5 bg-red-600 rounded-full mr-2"></span>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-red-600 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Support */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-1 h-5 bg-purple-600 rounded-full mr-2"></span>
              Support
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-all duration-300 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-purple-600 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Newsletter */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <span className="w-1 h-5 bg-blue-600 rounded-full mr-2"></span>
              Newsletter
            </h3>

            <p className="text-gray-400 text-sm mb-4">
              Get exclusive updates on new movies and offers!
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 text-white placeholder-gray-500
                  px-4 py-3 rounded-xl
                  border border-gray-700 focus:border-blue-600
                  outline-none transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-red-600 
                text-white px-4 py-3 rounded-xl
                hover:bg-red-700
                font-medium transition-all duration-300
                hover:scale-[1.02]"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-4 py-8 border-t border-gray-800">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 flex items-center justify-center
              bg-gray-900 rounded-full
              border border-gray-800
              hover:bg-gray-800 hover:scale-110
              transition-all duration-300
              text-2xl group relative"
              title={social.name}
            >
              <span>{social.icon}</span>
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2
              bg-gray-900 text-white text-xs py-1 px-2 rounded
              opacity-0 group-hover:opacity-100 transition-opacity duration-300
              whitespace-nowrap border border-gray-700">
                {social.name}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} CINEBOOK. All rights reserved.
              Made with <span className="text-red-500">❤</span> for movie lovers
            </p>

            <div className="flex gap-6">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
                Privacy
              </Link>
              <Link to="/terms" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
                Terms
              </Link>
              <Link to="/sitemap" className="text-gray-500 hover:text-white text-sm transition-colors duration-300">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;