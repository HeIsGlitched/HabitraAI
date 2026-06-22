//import express, cors, mongoose
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

//importing habit from models
const Habit = require("./models/Habit");

//importing user from models
const User = require("./models/User")

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

mongoose.connect("mongodb://divyanshu4987_db_user:NTcF6dxeWCTlZMaK@ac-59tup7o-shard-00-00.pnzanjk.mongodb.net:27017,ac-59tup7o-shard-00-01.pnzanjk.mongodb.net:27017,ac-59tup7o-shard-00-02.pnzanjk.mongodb.net:27017/?ssl=true&replicaSet=atlas-hi1jtm-shard-0&authSource=admin&appName=Cluster0")
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


app.post("/api/signup", async(req, res)=>{

    const existingUser = await User.findOne({
        email: req.body.email
    });

    if(existingUser){
        return res.json({
            message: "Email already in use"
        });
    }
    
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    res.json(newUser);
})

app.post("/api/login", async(req,res)=>{
    
    const user = await User.findOne({
        email:req.body.email
    })

    if(!user){
        return res.json({
            message: "User not found"
        });
    }

    if(user.password != req.body.password){
        return res.json({
            message: "Wrong password"
        });
    }

    res.json({
        message: "Login successful"
    });
})