//import express, cors, mongoose
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//importing habit from models
const Habit = require("./models/Habit");

// app stores server
const app = express();
app.use(cors());

app.use(express.json());

//basically browser's address
const PORT = 5000;

//route
app.get("/", (req, res) => {
    res.send("Server is running");
});

//get the data from the mongodb
app.get("/api/habits", async (req, res) => {
    const habits = await Habit.find();
    res.json(habits);
});

app.post("/api/habits", async(req, res)=>{
    const newHabit = await Habit.create({
        name: req.body.name
    });

    res.json(newHabit)
})

mongoose.connect("mongodb://divyanshu4987_db_user:ogqetEBOG3U0NPX8@ac-59tup7o-shard-00-00.pnzanjk.mongodb.net:27017,ac-59tup7o-shard-00-01.pnzanjk.mongodb.net:27017,ac-59tup7o-shard-00-02.pnzanjk.mongodb.net:27017/?ssl=true&replicaSet=atlas-hi1jtm-shard-0&authSource=admin&appName=Cluster0")
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


app.delete("/api/habits/:id", async (req, res) => {

    await Habit.findByIdAndDelete(req.params.id);

    res.json({
        message: "Habit deleted"
    });

});


app.put("/api/habits/:id", async (req, res) => {

    const updatedHabit =
    await Habit.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true
        }
    );

    res.json(updatedHabit);

});