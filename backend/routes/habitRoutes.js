const auth = require("../middleware/auth");          
const {
    getHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit
} = require("../controllers/habitController");


const express = require("express");
const router = express.Router();
router.get("/", auth, getHabits);

router.post("/", auth, createHabit);

router.put("/:id", auth, updateHabit);

router.delete("/:id", auth, deleteHabit);

router.put("/:id/toggle", auth, toggleHabit);

module.exports = router;