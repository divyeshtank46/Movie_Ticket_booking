const bcrypt = require("bcryptjs");
const UserModel = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
const { OAuth2Client } = require("google-auth-library")
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


const Register = async (req, res) => {
    try {
        const { Name, Email, Password, Role = "User" } = req.body;

        const existingUser = await UserModel.findOne({
            $or: [{ Email }, { Name }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User Already Exists"
            });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);

        const user = await UserModel.create({
            Name,
            Email,
            Password: hashedPassword,
            Role
        });

        const token = jwt.sign(
            {
                id: user._id,
                Role: user.Role
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production (https)
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "User Registered Successfully",
            user: {
                id: user._id,
                Name: user.Name,
                Email: user.Email,
                Role: user.Role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};


const Login = async (req, res) => {
    try {
        const { Email, Name, Password } = req.body;

        const user = await UserModel.findOne({
            $or: [{ Email }, { Name }]
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Username or Email"
            });
        }

        const isPasswordMatch = await bcrypt.compare(Password, user.Password);

        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                Role: user.Role
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: "User Logged In Successfully",
            user: {
                id: user._id,
                Name: user.Name,
                Email: user.Email,
                Role: user.Role
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
const Logout = (req, res) => {
    res.clearCookie("token");
    return res.status(200).json({
        message: "User logged out successfully"
    })
}

const userDetail = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).select("-Password");

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        return res.status(200).json({
            message: "User details fetched successfully",
            data: user
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            error
        });
    }
};

const getallUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select("-Password").sort({ createdAt: -1 });

        return res.status(200).json({
            message: users.length === 0
                ? "No Users Found"
                : "Users Fetched Successfully",
            count: users.length,
            data: users

        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message
        })
    }
}



const UpdateUSer = async (req, res) => {
    try {
        const userId = req.user.id;

        const updateData = { ...req.body };

        // ❌ prevent role change (Role with capital R)
        delete updateData.Role;

        // 🔐 hash password
        if (updateData.password || updateData.Password) {
            const plain = updateData.password || updateData.Password;
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(plain, salt);

            updateData.password = hashed;
            updateData.Password = hashed;
        }

        const result = await UserModel.findByIdAndUpdate(
            userId,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            data: result
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const SwitchRole = async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "USer Id Is Invalid"
            });
        }
        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found"
            })
        }
        const oldRole = user.Role;
        const newRole = user.Role === "Admin" ? "User" : "Admin"
        user.Role = newRole;
        await user.save();

        return res.status(200).json({
            success: true,
            message: `Role Switched ${oldRole} To ${newRole}`,
            User: user.Name,


        })
    } catch (error) {
        res.status(500).json({
            success: false,
            Error: error.message
        })
    }

}

const googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        // Google payload fields
        const { name, email, picture } = payload;

        let user = await UserModel.findOne({ Email: email });

        if (!user) {
            user = await UserModel.create({
                Name: name,
                Email: email,
                Password: "googleLogin",
                loginType: "google"
            });
        }

        const jwtToken = jwt.sign(
            {
                id: user._id,
                Role: user.Role
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1d" }
        );

        // store token in cookie
        res.cookie("token", jwtToken, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
            message: "Google login successful",
            user
        });

    } catch (err) {
        return res.status(500).json({
            message: "Google Login Failed",
            error: err.message
        });
    }
};
module.exports = userDetail;
module.exports = {
    Register,
    Logout,
    Login,
    userDetail,
    getallUsers,
    UpdateUSer,
    SwitchRole,
    googleLogin
}