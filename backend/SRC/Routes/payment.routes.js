const express = require('express');
const paymentController = require('../Controllers/payment.Controller')
const authMiddleware = require('../Middleware/authMiddleware');
const router = express.Router();

router.post("/create-order",paymentController.createOrder);
router.post("/verify", authMiddleware, paymentController.verifyPayment);

module.exports = router;
