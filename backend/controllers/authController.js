const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");

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

async function forgotPassword(req, res){
    try{

    

    const user = await User.findOne({
        email: req.body.email
    });

    if(!user){
        return res.status(404).json({
            message: "User not found"
        });
    }

    if(
    user.lastResetRequest &&
    Date.now() - user.lastResetRequest.getTime() < 60000
){
    return res.status(429).json({
        message: "Please wait before requesting another code."
    });
}

    const code = Math.floor(
        100000 + Math.random() * 900000
    ).toString();

    user.resetCode = code;

    user.resetCodeExpiry = Date.now() + 10 * 60 * 1000;
    user.lastResetRequest = new Date();

    await user.save();

   await sendEmail(
    user.email,
    "HabitraAI Password Reset",
`
<div style="
    max-width:500px;
    margin:auto;
    padding:30px;
    font-family:Arial,sans-serif;
    background:#1b1b1b;
    color:#f5f5f5;
    border-radius:12px;
    border:1px solid #2f2f2f;
">

    <h1 style="
        text-align:center;
        margin-bottom:10px;
    ">
        HabitraAI
    </h1>

    <h2 style="
        text-align:center;
        color:#9ca3af;
        font-weight:500;
    ">
        Password Reset
    </h2>

    <p>
        We received a request to reset your password.
    </p>

    <p>
        Use the verification code below:
    </p>

    <div style="
        background:#111111;
        border:1px solid #2f2f2f;
        border-radius:8px;
        padding:18px;
        text-align:center;
        font-size:34px;
        font-weight:bold;
        letter-spacing:8px;
        margin:25px 0;
    ">
        ${code}
    </div>

    <p>
        This code will expire in
        <strong>10 minutes</strong>.
    </p>

    <p style="color:#9ca3af;">
        If you didn't request this password reset,
        you can safely ignore this email.
    </p>

    <hr style="
        border:none;
        border-top:1px solid #2f2f2f;
        margin:30px 0;
    ">

    <p style="
        text-align:center;
        color:#777;
        font-size:14px;
    ">
        © HabitraAI
    </p>

</div>
`
);

    res.json({
        message: "Reset code sent"
    });
    }
    catch (err) {
        console.error(err);

        res.status(500).json({
            message: "Failed to send email"
        });
    }
}

async function verifyResetCode(req, res){

    const user = await User.findOne({
        email: req.body.email
    });

    if(!user){
        return res.status(404).json({
            message: "User not found"
        });
    }

    if(user.resetCode !== req.body.code){
        return res.status(400).json({
            message: "Invalid code"
        });
    }

    if(user.resetCodeExpiry < Date.now()){
        return res.status(400).json({
            message: "Code has expired"
        });
    }

    res.json({
        message: "Code verified"
    });
}

async function resetPassword(req, res){

    const user = await User.findOne({
        email: req.body.email
    });

    if(!user){
        return res.status(404).json({
            message: "User not found"
        });
    }

    if(user.resetCode !== req.body.code){
        return res.status(400).json({
            message: "Invalid code"
        });
    }

    if(user.resetCodeExpiry < Date.now()){
        return res.status(400).json({
            message: "Code has expired"
        });
    }

    const hashedPassword = await bcrypt.hash(
        req.body.newPassword,
        10
    );

    user.password = hashedPassword;

    user.resetCode = null;

    user.resetCodeExpiry = null;

    await user.save();

    res.json({
        message: "Password reset successfully"
    });

}
module.exports = {
    signup,
    login,
    getMe,
    changeEmail,
    changePassword,
    forgotPassword,
    verifyResetCode,
    resetPassword
};