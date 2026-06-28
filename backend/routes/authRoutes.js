const express = require("express");
const router = express.Router();
module.exports = router;

const {
    signup,
    login
} = require("../controllers/authController");

router.post("/signup", signup)


router.post("/login", login)
