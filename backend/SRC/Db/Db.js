const mongoose = require('mongoose');

const ConnectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Database Connected");
    }
    catch (error) {
        console.log("No Internet Connection or Cannot Reach Database");
    }
}

module.exports = ConnectDB;