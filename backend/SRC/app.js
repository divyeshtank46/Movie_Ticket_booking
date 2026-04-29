const express = require('express');
const authRoutes = require('./Routes/auth.routes');
const cors = require("cors")
const cookieParser = require('cookie-parser');
const cinemaroutes = require('./Routes/cinema.routes')
const movieroutes = require('./Routes/movie.routes')
const showroutes = require('./Routes/show.routes');
const bookingroutes = require('./Routes/booking.routes');
const paymentroutes = require('./Routes/payment.routes');
const app = express();
app.use(express.json());

app.set("trust proxy", 1);
app.use(cors({
    origin: "https://movie-ticket-booking-seven-brown.vercel.app",
    credentials: true
}));

app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/movie", movieroutes);
app.use("/api/cinema", cinemaroutes)
app.use("/api/ticket", bookingroutes)
app.use("/api/show", showroutes);
app.use("/api/payment", paymentroutes)
module.exports = app;
