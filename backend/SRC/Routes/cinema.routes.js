const express = require('express');
const router = express.Router();
const multer = require('multer');
const cinemaController = require('../Controllers/cinema.Controller');
const adminMiddleware = require('../Middleware/adminMiddleware')

const upload = multer({
    storage: multer.memoryStorage()
})

router.post("/addcinema", adminMiddleware, upload.array("Images", 5), cinemaController.addCinema);
router.get("/", cinemaController.getCinema);
router.patch("/:id", adminMiddleware, cinemaController.updateCinema);
router.delete("/:id", adminMiddleware, cinemaController.deleteCinema);
router.get("/cinema/:id",cinemaController.getsingleCinema);

module.exports = router;
