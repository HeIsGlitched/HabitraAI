const express = require("express");
const auth = require("../middleware/auth"); 
const router = express.Router();
module.exports = router;

const {
    signup,
    login,
    getMe
} = require("../controllers/authController");

router.post("/signup", signup)


router.post("/login", login)

router.get("/me",auth, getMe);