
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/UserModel');
const authMiddleware = async (req, res, next) => {
    try {

        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Token missing"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await UserModel
            .findById(decoded.id)
            .select("-Password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User Not Found"
            });
        }

        req.user = user;

        next();

    } catch (err) {

        console.log("JWT ERROR:", err.message);

        return res.status(401).json({
            success: false,
            message: "Invalid or Expired Token"
        });

    }
};
module.exports = authMiddleware;