const express = require('express');
const router = express.Router();
const showController = require('../Controllers/show.Controller');
const adminMiddleware = require('../Middleware/adminMiddleware');

router.get("/", showController.getShows)
router.get("/:movieId", showController.getShowByMovieId);  
router.get('/single/:showId',showController.getShowById);  
router.post("/create-multipleshows", adminMiddleware, showController.createMultpleShows);
router.delete("/:id", adminMiddleware, showController.deleteShowByMovieId);
router.delete("/show/:showid",adminMiddleware,showController.deleteshowById);
module.exports = router;