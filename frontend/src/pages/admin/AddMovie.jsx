import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { createMovie } from "../../services/Movieservice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddMovie = () => {
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  
  const movieSchema = Yup.object({
    image: Yup.mixed()
      .required("Movie poster is required")
      .test(
        "fileSize",
        "File too large (max 5MB)",
        (value) => value && value.size <= 5 * 1024 * 1024
      )
      .test(
        "fileType",
        "Only JPG / PNG allowed",
        (value) =>
          value && ["image/jpeg", "image/png", "image/jpg"].includes(value.type)
      ),
    title: Yup.string()
      .required("Movie title is required")
      .min(2, "Title must be at least 2 characters"),
    description: Yup.string()
      .required("Description is required")
      .min(10, "Description must be at least 10 characters"),
    duration: Yup.number()
      .required("Duration is required")
      .positive("Duration must be positive")
      .integer("Duration must be a number"),
    language: Yup.string().required("Language is required"),
    releaseDate: Yup.date().required("Release date is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Price must be greater than 0"),
    showTimes: Yup.string().required("Show times are required"),
    status: Yup.string().required("Status is required"),
  });
  
  const formik = useFormik({
    initialValues: {
      image: null,
      title: "",
      description: "",
      duration: "",
      language: "",
      releaseDate: "",
      price: "",
      showTimes: "",
      status: "Now showing",
    },
    validationSchema: movieSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        formData.append("image", values.image);
        formData.append("title", values.title);
        formData.append("description", values.description);
        formData.append("duration", values.duration);
        formData.append("language", values.language);
        formData.append("releaseDate", values.releaseDate);
        formData.append("price", values.price);
        formData.append("showTimes", values.showTimes);
        formData.append("status", values.status);
        
        const res = await createMovie(formData);
        toast.success(res.message || "Movie Successfully Added");
        navigate('/admin/movies');
      } catch (err) {
        console.log(err);
        toast.error(err.message || "Failed To Create Movie");
      }
    }
  });

  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0];
    
    if (!file) {
      formik.setFieldValue("image", null);
      setImagePreview(null);
      return;
    }
    
    const isValidSize = file.size <= 5 * 1024 * 1024;
    const isValidType = ["image/jpeg", "image/png", "image/jpg"].includes(file.type);
    
    if (!isValidSize) {
      toast.error("File too large (max 5MB)");
      return;
    }
    
    if (!isValidType) {
      toast.error("Only JPG / PNG files are allowed");
      return;
    }
    
    formik.setFieldValue("image", file);
    formik.setFieldTouched("image", true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 relative overflow-hidden">
      {/* Decorative Film Strip */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-red-600"></div>

      {/* Background Icons */}
      <div className="absolute top-20 left-10 text-6xl opacity-5">🎬</div>
      <div className="absolute bottom-20 right-10 text-6xl opacity-5">🎥</div>

      {/* Main Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-red-500">
            Add New Movie
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Fill in the details below to add a new movie to the collection
          </p>
          <div className="w-24 h-0.5 bg-red-600 mx-auto mt-6"></div>
        </div>

        {/* Form Card */}
        <div className="bg-gray-900 rounded-3xl 
                    border border-gray-800 shadow-2xl overflow-hidden
                    transform transition-all duration-500
                    hover:shadow-2xl hover:shadow-red-900/20">

          <div className="p-6 sm:p-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Movie Poster <span className="text-red-400">*</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1">
                    <div className="relative">
                      <input
                        type="file"
                        name="image"
                        accept="image/jpeg,image/png,image/jpg"
                        onChange={handleImageChange}
                        className="hidden"
                        id="imageUpload"
                      />
                      <label
                        htmlFor="imageUpload"
                        className={`flex items-center justify-center gap-2
                                                    w-full px-4 py-3 
                                                    bg-gray-800
                                                    border-2 border-dashed border-gray-700 
                                                    rounded-xl cursor-pointer
                                                    hover:bg-gray-700 hover:border-red-800
                                                    transition-all duration-300`}
                      >
                        <span className="text-2xl">📸</span>
                        <span>Select Image from Storage</span>
                      </label>
                    </div>
                    {formik.touched.image && formik.errors.image && (
                      <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                        <span>⚠️</span> {formik.errors.image}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Supported formats: JPG, PNG (Max 5MB)
                    </p>
                  </div>

                  {imagePreview && (
                    <div className="relative group">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-24 h-32 object-cover rounded-lg border-2 border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          formik.setFieldValue("image", null);
                          setImagePreview(null);
                          const fileInput = document.getElementById('imageUpload');
                          if (fileInput) fileInput.value = '';
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 
                                                    bg-red-600 rounded-full flex items-center justify-center
                                                    text-white text-xs hover:bg-red-700 transition
                                                    opacity-0 group-hover:opacity-100"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Movie Title <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    🎬
                  </span>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter movie title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-4 py-3 
                                            bg-gray-800
                                            border rounded-xl
                                            text-white placeholder-gray-500
                                            focus:outline-none focus:ring-2
                                            transition-all duration-300
                                            ${formik.touched.title && formik.errors.title
                        ? "border-red-600 focus:ring-red-600"
                        : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
                      }`}
                  />
                </div>
                {formik.touched.title && formik.errors.title && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {formik.errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Description <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">
                    📝
                  </span>
                  <textarea
                    name="description"
                    rows="4"
                    placeholder="Enter movie description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-4 py-3 
                                            bg-gray-800
                                            border rounded-xl
                                            text-white placeholder-gray-500
                                            focus:outline-none focus:ring-2
                                            transition-all duration-300 resize-none
                                            ${formik.touched.description && formik.errors.description
                        ? "border-red-600 focus:ring-red-600"
                        : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
                      }`}
                  />
                </div>
                {formik.touched.description && formik.errors.description && (
                  <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                    <span>⚠️</span> {formik.errors.description}
                  </p>
                )}
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Duration */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Duration (minutes) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      ⏱️
                    </span>
                    <input
                      type="number"
                      name="duration"
                      placeholder="120"
                      value={formik.values.duration}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full pl-10 pr-4 py-3 
                                                bg-gray-800
                                                border rounded-xl
                                                text-white placeholder-gray-500
                                                focus:outline-none focus:ring-2
                                                transition-all duration-300
                                                ${formik.touched.duration && formik.errors.duration
                          ? "border-red-600 focus:ring-red-600"
                          : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
                        }`}
                    />
                  </div>
                  {formik.touched.duration && formik.errors.duration && (
                    <p className="text-red-400 text-sm">{formik.errors.duration}</p>
                  )}
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Language <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      🌐
                    </span>
                    <input
                      type="text"
                      name="language"
                      placeholder="Hindi, English"
                      value={formik.values.language}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full pl-10 pr-4 py-3 
                                                bg-gray-800
                                                border rounded-xl
                                                text-white placeholder-gray-500
                                                focus:outline-none focus:ring-2
                                                transition-all duration-300
                                                ${formik.touched.language && formik.errors.language
                          ? "border-red-600 focus:ring-red-600"
                          : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
                        }`}
                    />
                  </div>
                  {formik.touched.language && formik.errors.language && (
                    <p className="text-red-400 text-sm">{formik.errors.language}</p>
                  )}
                </div>

                {/* Release Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Release Date <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      📅
                    </span>
                    <input
                      type="date"
                      name="releaseDate"
                      value={formik.values.releaseDate}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full pl-10 pr-4 py-3 
                                                bg-gray-800
                                                border rounded-xl
                                                text-white
                                                focus:outline-none focus:ring-2
                                                transition-all duration-300
                                                ${formik.touched.releaseDate && formik.errors.releaseDate
                          ? "border-red-600 focus:ring-red-600"
                          : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
                        }`}
                    />
                  </div>
                  {formik.touched.releaseDate && formik.errors.releaseDate && (
                    <p className="text-red-400 text-sm">{formik.errors.releaseDate}</p>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Price (₹) <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      💰
                    </span>
                    <input
                      type="number"
                      name="price"
                      placeholder="250"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`w-full pl-10 pr-4 py-3 
                                                bg-gray-800
                                                border rounded-xl
                                                text-white placeholder-gray-500
                                                focus:outline-none focus:ring-2
                                                transition-all duration-300
                                                ${formik.touched.price && formik.errors.price
                          ? "border-red-600 focus:ring-red-600"
                          : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
                        }`}
                    />
                  </div>
                  {formik.touched.price && formik.errors.price && (
                    <p className="text-red-400 text-sm">{formik.errors.price}</p>
                  )}
                </div>
              </div>
              
              {/* Show Times */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">
                  Show Times (comma separated) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    ⏰
                  </span>
                  <input
                    type="text"
                    name="showTimes"
                    placeholder="10:00 AM, 1:30 PM, 6:45 PM"
                    value={formik.values.showTimes}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`w-full pl-10 pr-4 py-3 
                                            bg-gray-800
                                            border rounded-xl
                                            text-white placeholder-gray-500
                                            focus:outline-none focus:ring-2
                                            transition-all duration-300
                                            ${formik.touched.showTimes && formik.errors.showTimes
                        ? "border-red-600 focus:ring-red-600"
                        : "border-gray-700 focus:border-red-600 focus:ring-red-600/50"
                      }`}
                  />
                </div>
                {formik.touched.showTimes && formik.errors.showTimes && (
                  <p className="text-red-400 text-sm">{formik.errors.showTimes}</p>
                )}
                <p className="text-xs text-gray-500">Separate multiple show times with commas</p>
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
                                            focus:outline-none focus:ring-2 focus:ring-red-600/50
                                            transition-all duration-300
                                            appearance-none cursor-pointer"
                  >
                    <option value="Now showing" className="bg-gray-900">Now showing</option>
                    <option value="Upcoming" className="bg-gray-900">Upcoming</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <span className="text-gray-400">▼</span>
                  </div>
                </div>
                {formik.touched.status && formik.errors.status && (
                  <p className="text-red-400 text-sm">{formik.errors.status}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-red-600 
                                    text-white py-3.5 rounded-xl font-semibold text-lg
                                    hover:bg-red-700
                                    transition-all duration-300
                                    hover:scale-[1.02] hover:shadow-lg hover:shadow-red-900/30"
              >
                Add Movie →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMovie;