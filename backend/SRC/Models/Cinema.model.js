const mongoose = require('mongoose');
const { applyTimestamps } = require('./UserModel');


const cinemaSchema = mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
            trim: true
        },
        City: {
            type: String,
            required: true
        },
        Address: {
            type: String,
            required: true
        },
        TotalScreens: {
            type: Number,
            required: true,
            min: 1
        },
        ContactNumber: {
            type: String
        },
        Facilities: [
            {
                type: String
            }
        ],
        Status: {
            type: String,
            enum: ["Active", "Inactive"],
            Default: "Active"
        },
        Images: [
            {
                type: String
            }
        ]
    }, { timestamps: true });

    const CinemaModel = mongoose.model("Cinema",cinemaSchema);
    module.exports = CinemaModel;
