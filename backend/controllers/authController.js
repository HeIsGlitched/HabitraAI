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

async function getMe(req, res) {

    const user = await User.findById(req.userId);

    res.json({
        name: user.name,
        email: user.email
    });

}
async function changeEmail(req, res){

    const user = await User.findById(req.userId);

    const correctPassword = await bcrypt.compare(
        req.body.password,
        user.password
    );

    if(!correctPassword){
        return res.status(400).json({
            message: "Incorrect password"
        });
    }

    const existingUser = await User.findOne({
        email: req.body.email
    });

    if(existingUser && existingUser._id.toString() !== user._id.toString()){
        return res.status(400).json({
            message: "Email already exists"
        });
    }

    user.email = req.body.email;

    await user.save();

    res.json({
        message: "Email updated successfully"
    });

}
async function changePassword(req, res){

    const user = await User.findById(req.userId);

    const correctPassword = await bcrypt.compare(
        req.body.currentPassword,
        user.password
    );

    if(!correctPassword){
        return res.status(400).json({
            message: "Current password is incorrect"
        });
    }

    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

    user.password = hashedPassword;

    await user.save();

    res.json({
        message: "Password updated successfully"
    });

}
module.exports = {
    signup,
    login,
    getMe,
    changeEmail,
    changePassword
};