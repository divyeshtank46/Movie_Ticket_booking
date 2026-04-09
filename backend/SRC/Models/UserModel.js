const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
            unique: true
        },
        Email: {
            type: String,
            required: true,
            unique: true
        },
        Password: {
            type: String,
            required: true,
            // select:false
        },
        Role: {
            type: String,
            required: true,
            enum: ["User", "Admin"],
            default: "User"
        },
        bookings: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Booking"
            }
        ]
    },
    { timestamps: true }
)
const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;