const express = require('express');
const authMiddleware = require('../Middleware/authMiddleware')
const router = express.Router();
const bookingController = require('../Controllers/booking.Controller');
const adminMiddleware = require('../Middleware/adminMiddleware');

router.post("/book", authMiddleware, bookingController.bookTicket)
router.get("/bookings", authMiddleware, bookingController.getBookings);
router.get("/allbookings", adminMiddleware, bookingController.getallBookings);
router.delete("/:id", authMiddleware, bookingController.deleteBookings);
router.get("/admin/revenue",adminMiddleware,bookingController.totalRevenue);
router.delete("/frontend/deleteallbookings", adminMiddleware, bookingController.deleteAllBookings);
module.exports = router;