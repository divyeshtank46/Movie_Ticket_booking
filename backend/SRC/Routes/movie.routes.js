const express = require('express');
const router = express.Router();
const multer = require('multer');
const movieController = require('../Controllers/movie.Controller');
const adminMiddleware = require('../Middleware/adminMiddleware');
const upload = multer({
    storage: multer.memoryStorage()
});

router.post("/add", adminMiddleware, upload.single("image"), movieController.addMovie);
router.get("/movies", movieController.getMovies);
router.patch("/movies/:id", adminMiddleware,upload.single("image"), movieController.updateMovie);
router.delete("/movies/:id", adminMiddleware, movieController.deleteMovie);
router.get("/search",movieController.searchMovies);
router.get("/movie/:id",movieController.getsingleMovie)
module.exports = router;
