//import express, cors, mongoose
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const jwt = require("jsonwebtoken");

const bcrypt = require("bcrypt");

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


//middleware
function auth(req, res, next){

    const token = req.headers.authorization;

    if(!token){
        return res.json({
            message: "No token provided"
        });
    }

    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET
    );

    req.userId = decoded.userId;

    next();
}

//get the data from the mongodb
app.get("/api/habits", auth, async (req, res) => {
    const habits = await Habit.find({
        user: req.userId
    });

    res.json(habits);
});

app.post("/api/habits", auth, async(req, res)=>{
    const newHabit = await Habit.create({
        name: req.body.name,
        user: req.userId
    });

    res.json(newHabit)
})

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
    
    const hashedPassword = await bcrypt.hash(
    req.body.password,
    10
);

const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
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

    const isMatch = await bcrypt.compare(
    req.body.password,
    user.password
);

if(!isMatch){
    return res.json({
        message: "Wrong password"
    });
}
    
    const token = jwt.sign(
        {
            userId: user._id 
        },
        process.env.JWT_SECRET
 )

    res.json({
        message: "Login successful",
        token:token
    });
})