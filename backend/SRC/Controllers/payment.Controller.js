const razorpay = require("../Config/razorpay");

const createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const options = {
            amount: amount * 100,
            currency: "INR"
        };

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            order
        });

    } catch (error) {
        console.log("ENV CHECK:", process.env.RAZORPAY_KEY_ID);
        return res.status(500).json({
            success: false,
            message: `Order Creation Failed ${error.message}`
        });
    }
};

module.exports = { createOrder };