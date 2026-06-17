//import express, cors
const express = require("express");
const cors = require("cors");

// app stores server
const app = express();
app.use(cors());

//basically browser's address
const PORT = 5000;

//route
app.get("/", (req, res) => {
    res.send("Server is running");
});

app.get("/api/habits", (req, res) => {
    const habits = [
        {
            id: 1,
            name: "Workout",
            completed: true
        },
        {
            id: 2,
            name: "Read 10 Pages",
            completed: false
        },
        {
            id: 3,
            name: "Meditate",
            completed: true
        }
    ];

    res.json(habits);
});

//start the server and keep listening for the requests on this port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});