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
        return res.status(401).json({
            message: "No token provided"
        });
    }

    try{

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.userId = decoded.userId;

        next();

    }
    catch(error){

        return res.status(401).json({
            message: "Invalid token"
        });

    }

}

function calculateStreak(completedDates){
    if(completedDates.length === 0){
        return 0;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dates = completedDates.map(function(date){
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    });
    dates.sort(function(a, b){
        return b - a;
    });

    const completedToday = dates.find(function(date){
        return date.getTime() === today.getTime();
    });

    if(!completedToday){
        return 0;
    }

    let streak = 1;
    let currentDate = new Date(today);
    
    while(true){
    
        currentDate.setDate(currentDate.getDate() - 1);
    
        const found = dates.find(function(date){
            return date.getTime() === currentDate.getTime();
        });
    
        if(found){
            streak++;
        }
        else{
            break;
        }
    
    }
    
    return streak;
}

//get the data from the mongodb
app.get("/api/habits", auth, async (req, res) => {

    const habits = await Habit.find({
        user: req.userId
    });

    const habitsWithStreak = habits.map(function(habit){

        return {
            ...habit.toObject(),
            streak: calculateStreak(habit.completedDates)
        };

    });

    res.json(habitsWithStreak);

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


app.delete("/api/habits/:id",auth , async (req, res) => {

    const deletedHabit = await Habit.findOneAndDelete({
    _id: req.params.id,
    user: req.userId
});
    
    if(!deletedHabit){
    return res.status(404).json({
        message: "Habit not found"
    });
}
    res.json({
        message: "Habit deleted"
    });

});


app.put("/api/habits/:id",auth , async (req, res) => {

    const updatedHabit = await Habit.findOneAndUpdate(
    {
        _id: req.params.id,
        user: req.userId
    },
    req.body,
    {
        new: true
    }
);
    if(!updatedHabit){
    return res.status(404).json({
        message: "Habit not found"
    });
}
    res.json(updatedHabit);

});

app.put("/api/habits/:id/toggle", auth, async (req, res) => {
    const habit = await Habit.findOne({
        _id: req.params.id,
        user: req.userId
    });

    if(!habit){
        return res.status(404).json({
            message: "Habit not found"
        });
    }

    const today = new Date();
    const alreadyCompleted = habit.completedDates.find(function(date){
        return date.toDateString() === today.toDateString();
    });
    if(!alreadyCompleted){
        habit.completedDates.push(today);
    }
    else{
        habit.completedDates = habit.completedDates.filter(function(date){
            return date.toDateString() !== today.toDateString();
        });
    }
    await habit.save();
    const habitObject = habit.toObject();

habitObject.streak = calculateStreak(habit.completedDates);

res.json(habitObject);
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