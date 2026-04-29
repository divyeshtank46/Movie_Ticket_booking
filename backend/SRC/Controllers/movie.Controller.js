const mongoose = require('mongoose')
const MovieModel = require('../Models/Movie.model');
const jwt = require('jsonwebtoken');
const { uploadFile } = require('../Services/Storage.service');

const addMovie = async (req, res) => {
    try {

        if (!req.file) {
            return res.status(400).json({
                message: "Poster image is required"
            });
        }

        const {
            title,
            description,
            duration,
            language,
            releaseDate,
            price,
            showTimes,
            status
        } = req.body;

        const uploadResult = await uploadFile(
            req.file.buffer.toString("base64")
        );

        const movie = await MovieModel.create({
            title,
            description,
            duration,
            language,
            releaseDate,
            price,
            showTimes,
            status,
            poster: uploadResult.url
        });

        return res.status(201).json({
            message: "Movie Added Successfully",
            movie
        });

    } catch (err) {
        return res.status(500).json({
            message: "Server error",
            error: err.message
        });
    }
};

const getMovies = async (req, res) => {
    try {
        const movies = await MovieModel.find().sort({ createdAt: -1 });
        if (movies.length === 0) {
            return res.status(404).json({
                message: "No Movies found"
            })
        }
        res.status(200).json({
            count: movies.length,
            movies
        })
    } catch (err) {
        res.status(500).json({
            message: "Server Error",
            err
        })
    }
}

const getsingleMovie = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            message: "Invalid Movie ID"
        })
    }
    const movie = await MovieModel.findById(id);
    try {
        if (!movie) {
            return res.status(404).json({
                message: "Movie Not Found"
            });
        }
        return res.status(200).json({
            message: "Movie Fetched Sucessfully",
            data: movie
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
}

const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Movie ID"

            })
        }

        const updateData = { ...req.body };
        if (req.file) {
            updateData.image = req.file.buffer.toString("base64");
            updateData.imageType = req.file.mimetype;
        }
        const updateMovie = await MovieModel.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true });
        res.status(200).json({
            message: "Movie Updated Successfully",
            updateMovie
        })

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            err
        })
    }

}

const deleteMovie = async (req, res) => {
    try {
        const id = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                message: "Invalid Movie ID"
            })
        }
        const deleteMovie = await MovieModel.findByIdAndDelete(req.params.id);
        if (!deleteMovie) {
            return res.status(404).json({
                message: "Movie Not Found"
            });
        }
        res.status(200).json({
            message: "Movie Deleted Successfully"
        })

    } catch (err) {
        res.status(500).json({
            message: "Internal Server Error",
            err
        })
    }


}

const searchMovies = async (req, res) => {
    try {
        const { name } = req.query;
        if (!name) {
            return res.status(400).json({
                message: "Enter Movie Name  to Search"
            })
        }
        const movies = await MovieModel.find({
            title: { $regex: name, $options: "i" }
        })
        if (movies.length === 0) {
            return res.status(404).json({
                message: "No movies found with this name"
            })
        }
        return res.status(200).json({
            message: "Movie Found Successfully",
            data: movies
        });
    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        })
    }
}

module.exports = {
    addMovie,
    getMovies,
    updateMovie,
    deleteMovie,
    searchMovies,
    getsingleMovie
};