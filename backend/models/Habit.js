const mongoose = require("mongoose")
const habitSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    completedDates: [
        {
            type: Date
        }
    ],

    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Habit", habitSchema);