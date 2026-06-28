const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function signup(req, res){
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
}

async function login(req, res){
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
}

module.exports = {
    signup,
    login
};