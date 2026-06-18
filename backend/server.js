//import express, cors
const express = require("express");
const cors = require("cors");

// app stores server
const app = express();
app.use(cors());

app.use(express.json());

//basically browser's address
const PORT = 5000;

//temp database
let habits = [
    {
        id: 1,
        name: "Workout",
        completed: true
    }
];
//route
app.get("/", (req, res) => {
    res.send("Server is running");
});

app.get("/api/habits", (req, res) => {
    res.json(habits);
});

app.post("/api/habits", (req, res)=>{
    const newHabit = {
        id:Date.now(),
        name:req.body.name,
        completed:false
    }
    habits.push(newHabit);
    res.json(newHabit);
})

//start the server and keep listening for the requests on this port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});