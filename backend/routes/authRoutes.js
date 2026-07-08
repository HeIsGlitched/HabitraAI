const express = require("express");
const auth = require("../middleware/auth"); 
const router = express.Router();
module.exports = router;

const {
    signup,
    login,
    getMe,
    changeEmail,
    changePassword
} = require("../controllers/authController");

router.post("/signup", signup)

router.put("/me/email", auth, changeEmail);

router.post("/login", login)

router.put("/me/password", auth, changePassword);

router.get("/me",auth, getMe);