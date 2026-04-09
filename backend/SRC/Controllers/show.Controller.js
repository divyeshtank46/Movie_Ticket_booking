
const { default: mongoose } = require('mongoose');
const showModel = require('../Models/Show.model');
// const MovieModel = require('../Models/Movie.model');
const createMultpleShows = async (req, res) => {
    try {
        const { movieId, cinemaId, showDate, shows } = req.body;
        const showData = shows.map((s) => ({
            movieId,
            cinemaId,
            showDate,
            showTime: s.showTime,
            price: s.price
        }));
        const createdShows = await showModel.insertMany(showData);
        return res.status(201).json({
            success: true,
            message: "Show Created Successfully",
            data: createdShows
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }

}
const getShowById = async (req, res) => {
    try {
        const { showId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(showId)) {
            return res.status(400).json({
                message: "Invalid Show ID"
            });
        }
        const show = await showModel.findById(showId)
            .populate('movieId')
            .populate('cinemaId')

        if (!show) {
            return res.status(404).json({
                success: false,
                message: "Show not found"
            });
        }
        res.status(200).json({
            success: true,
            message: "Show Fetched Successfully",
            data: show
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

const getShowByMovieId = async (req, res) => {
    try {
        const { movieId } = req.params;

        // ✅ Validate ID
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({
                message: "Invalid Movie ID"
            });
        }

        const shows = await showModel
            .find({ movieId })
            .populate("cinemaId")
            .populate("movieId", "title status")
            .sort({ showTime: 1 });

        if (!shows.length) {
            return res.status(404).json({
                message: "No Shows Found For This Movie"
            });
        }

        return res.status(200).json({
            count: shows.length,
            message: "Shows Fetched Successfully",
            data: shows
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};
const getShows = async (req, res) => {

    const show = await showModel.find().populate("cinemaId");
    try {
        if (!show) {
            return res.status(404).json({
                message: "No Shows Available"
            })
        }
        return res.status(200).json({
            count: show.length,
            message: "Shows Fetched Successfully",
            data: show
        })

    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
}

const deleteshowById = async (req, res) => {
    const { showid } = req.params;
    if (!mongoose.Types.ObjectId.isValid(showid)) {
        return res.status(400).json({
            success: false,
            message: "Invalid MovieId"
        })
    }

    try {
        const result = await showModel.findByIdAndDelete(showid);
        if (!result) {
            return res.status(404).json({
                message: "No Shows Found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Show Deleted Successfully",
            result
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Sever Error",
            error: err.message
        })
    }
}

const deleteShowByMovieId = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
            success: false,
            message: "Invalid MovieId",
        });
    }

    try {
        const result = await showModel.deleteMany({ movieId: id });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No Shows Found With This MovieId",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Shows Deleted Successfully",
            deletedCount: result.deletedCount,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: err.message,
        });
    }
};
module.exports = {
    createMultpleShows,
    deleteShowByMovieId,
    getShows,
    getShowByMovieId,
    getShowById,
    deleteshowById
}