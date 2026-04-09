const jwt = require('jsonwebtoken');
const UserModel = require('../Models/UserModel');

const adminMiddleware = async(req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }
        if (decoded.Role !== "Admin") {
            return res.status(403).json({
                message: "You Are Not Authorized To Perform This Action"
            })
        }
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid or Expired Token",
            error: error.message
        })
    }
}
module.exports = adminMiddleware;