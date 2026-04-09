// const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const CinemaModel = require('../Models/Cinema.model');

const { uploadFile } = require('../Services/Storage.service');
const { default: mongoose } = require('mongoose');

const addCinema = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cinema images are required"
            });
        }
        if (req.files.length > 5) {
            return res.status(400).json({
                success: false,
                message: "Maximum 5 images allowed"
            });
        }

        const {
            Name,
            City,
            Address,
            TotalScreens,
            ContactNumber,
            Facilities,
            Status
        } = req.body;
        const imageUrls = [];
        for (let file of req.files) {
            const result = await uploadFile(
                file.buffer.toString("base64"),
                "Cinema"
            );
            imageUrls.push(result.url);
        }

        const cinema = await CinemaModel.create(
            {
                Name,
                City,
                Address,
                TotalScreens,
                ContactNumber,
                Facilities,
                Status,
                Images: imageUrls
            })
        return res.status(201).json({
            message: "Cinema Created Successfully",
            cinema
        })
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

const getCinema = async (req, res) => {
    try {
        const cinema = await CinemaModel.find().sort({ createdAt: -1 }).select("-__v");;
        return res.status(200).json({
            count: cinema.length,
            cinema
        })

    } catch (error) {
        return res.status(500).json({
            message: "Failed To Fetch cinema",
            error: error.message
        })
    }
}

const getsingleCinema = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid cinema Id"
        })
    }
    try {
        const cinema = await CinemaModel.findById(id).select("-__v");;
        if (!cinema) {
            return res.status(404).json({
                message: "Cinema Not found"
            })
        }

        return res.status(200).json({
            message: "Cinema Fetched Successfully",
            data: cinema
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

const updateCinema = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid cinema ID"
            })
        }

        const updatedCinema = await CinemaModel.findByIdAndUpdate(
            id,
            req.body,

            {
                new: true,          // return updated document
                runValidators: true
            })
        if (!updatedCinema) {
            return res.status(404).json({
                message:"Cinema Not Found"
            })
        }
        return res.status(200).json({
            message: "Cinema Updated Successfully",
            updatedCinema
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed To UpdateCinema",
            error: error.message
        })
    }
}

const deleteCinema = async (req, res) => {
    try {

        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Cinema ID"
            })
        }
        const deletedCinema = await CinemaModel.findByIdAndDelete(id);
        if (!deletedCinema) {
            return res.status(404).json({
                message: "Cinema Not Found"
            })
        }
        return res.status(200).json({
            message: "Cinema Deleted Successfully"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Failed To Delete Cinema",
            error: error.message
        })
    }

}

module.exports = {
    addCinema,
    getCinema,
    updateCinema,
    deleteCinema,
    getsingleCinema
}