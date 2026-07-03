const auth = require("../middleware/auth");          
const {
    getHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit,
    getHistory,
    toggleHistory
} = require("../controllers/habitController");


const express = require("express");
const router = express.Router();
router.get("/", auth, getHabits);

router.post("/", auth, createHabit);

router.get("/history", auth, getHistory);

router.put("/:id", auth, updateHabit);

router.delete("/:id", auth, deleteHabit);

router.put("/:id/toggle", auth, toggleHabit);

router.put("/:id/history", auth, toggleHistory);

module.exports = router;