require("dotenv").config();
const habitRoutes = require("./routes/habitRoutes");
const authRoutes = require("./routes/authRoutes");

//import express, cors, mongoose
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// app stores server
const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/habits", habitRoutes);
app.use("/api", authRoutes);

//basically browser's address
const PORT = 5000;

//route
app.get("/", (req, res) => {
    res.send("Server is running");
});


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

//start the server and keep listening for the requests on this port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});