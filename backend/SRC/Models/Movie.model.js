const mongoose = require('mongoose');
const movieSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            required: true
        },
        poster: {
            type: String,
            required: true

        },
        duration: {
            type: Number,
            required: true,
            min: 1
        },
        language: {
            type: String,
            required: true,

        },
        releaseDate: {
            type: Date,
            required: true,
        },
        price: {
            type: Number,
            // required: true,
            min: 0,
        },
        showTimes: [
            {
                type: String,
                required: true
            }
        ],
        status: {
            type: String,
            enum: ["Now showing", "Upcoming"],
            default: "Now showing"
        }
    },
    { timestamps: true }
)
const MovieModel = mongoose.model("product", movieSchema);
module.exports = MovieModel;
