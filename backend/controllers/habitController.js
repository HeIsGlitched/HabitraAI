const Habit = require("../models/Habit");
const calculateStreak = require("../utils/calculateStreak");
const calculateGlobalStreak = require("../utils/calculateGlobalStreak");
const calculateWeekHistory = require("../utils/calculateWeekHistory");

async function getHabits(req, res){
    const habits = await Habit.find({
        user: req.userId
    });
    const globalStreak = calculateGlobalStreak(habits);
    const weekHistory = calculateWeekHistory(habits);
        const habitsWithStreak = habits.map(function(habit){
            return {
                ...habit.toObject(),
                streak: calculateStreak(habit.completedDates)
            };
        });
        res.json({
    habits: habitsWithStreak,
    globalStreak: globalStreak,
    weekHistory: weekHistory
});
}

async function createHabit(req, res){
    const newHabit = await Habit.create({
        name: req.body.name,
        user: req.userId
    });
    const habitObject = newHabit.toObject();
    habitObject.streak = calculateStreak(newHabit.completedDates);
    res.json(habitObject);
    
}
async function updateHabit(req, res){
    const updatedHabit = await Habit.findOneAndUpdate(
    {
        _id: req.params.id,
        user: req.userId
    },
    req.body,
    {
        new: true
    }
);
    if(!updatedHabit){
    return res.status(404).json({
        message: "Habit not found"
    });
}
    res.json(updatedHabit);
}

async function deleteHabit(req, res){
        const deletedHabit = await Habit.findOneAndDelete({
    _id: req.params.id,
    user: req.userId
});
    
    if(!deletedHabit){
    return res.status(404).json({
        message: "Habit not found"
    });
}
    res.json({
        message: "Habit deleted"
    });
}

async function toggleHabit(req,res){
    const habit = await Habit.findOne({
        _id: req.params.id,
        user: req.userId
    });

    if(!habit){
        return res.status(404).json({
            message: "Habit not found"
        });
    }

    const today = new Date();
    const alreadyCompleted = habit.completedDates.find(function(date){
        return date.toDateString() === today.toDateString();
    });
    if(!alreadyCompleted){
        habit.completedDates.push(today);
    }
    else{
        habit.completedDates = habit.completedDates.filter(function(date){
            return date.toDateString() !== today.toDateString();
        });
    }
    await habit.save();
    const habitObject = habit.toObject();
    habitObject.streak = calculateStreak(habit.completedDates);
    const habits = await Habit.find({
        user: req.userId
    });
    const globalStreak = calculateGlobalStreak(habits);
    const weekHistory = calculateWeekHistory(habits);

    res.json({
    habit: habitObject,
    globalStreak: globalStreak,
    weekHistory: weekHistory
});

}

module.exports = {
    getHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    toggleHabit
};