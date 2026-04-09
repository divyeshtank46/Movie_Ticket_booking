require("dotenv").config();
const mongoose = require('mongoose');
const Show = require('../Models/Show.model');
const Movie = require('../Models/Movie.model');
const Cinema = require('../Models/Cinema.model');
const MONGO_URI = process.env.MONGODB_URL;
const showTimes = ["10:30 AM", "1:30 PM", "4:30 PM", "7:30 PM", "10:30 PM"];
const priceByShowTime = {
    "10:30 AM": { silver: 100, gold: 150, platinum: 200 },
    "1:30 PM": { silver: 120, gold: 180, platinum: 250 },
    "4:30 PM": { silver: 150, gold: 220, platinum: 300 },
    "7:30 PM": { silver: 200, gold: 300, platinum: 400 },
    "10:30 PM": { silver: 180, gold: 250, platinum: 350 }
}
const genrateShows = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("DATABASE CONNECTED");
        const movies = await Movie.find();
        const cinemas = await Cinema.find();

        if (!movies.length || !cinemas.length) {
            console.log("❌ Movies or Cinemas not found");
            process.exit();
        }

        const shows = [];
        for (let movie of movies) {
            for (let cinema of cinemas) {
                for (let time of showTimes) {
                    shows.push({
                        movieId: movie._id,
                        cinemaId: cinema._id,
                        showDate: new Date(),
                        showTime: time,
                        price: priceByShowTime[time],
                        totalSeats: 120,
                        bookedSeats: []
                    })
                }
            }
        }
        await Show.insertMany(shows);
        console.log(`🔥${shows.length} shows  inserted Succesfully`);
        process.exit();
    }
    catch (error) {
        console.log("❌ Error:", error);
        process.exit(1);
    }
}
genrateShows();