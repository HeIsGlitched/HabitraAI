const express = require("express");
const auth = require("../middleware/auth"); 
const sendEmail = require("../utils/email");
const router = express.Router();
module.exports = router;

const {
    signup,
    login,
    getMe,
    changeEmail,
    changePassword,
    forgotPassword,
    verifyResetCode,
    resetPassword
} = require("../controllers/authController");

router.post("/signup", signup)

router.put("/me/email", auth, changeEmail);

router.post("/login", login)

router.put("/me/password", auth, changePassword);

router.get("/me",auth, getMe);

router.post("/forgot-password", forgotPassword);

router.post("/verify-reset-code", verifyResetCode);
router.put("/reset-password", resetPassword);