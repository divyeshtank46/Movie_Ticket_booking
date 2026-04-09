const express = require('express');
const paymentController = require('../Controllers/payment.Controller')
const router = express.Router();

router.post("/create-order",paymentController.createOrder);

module.exports = router;