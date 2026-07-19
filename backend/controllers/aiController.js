const Habit = require("../models/Habit");
const generateInsights = require("../utils/ai");

async function getInsights(req, res){

    const habits = await Habit.find({
        user: req.userId
    });

    const prompt = `
You are an AI habit coach.

Here are the user's habits:

${JSON.stringify(habits, null, 2)}

Analyze these habits and provide:

1. Three personalized insights.
2. One improvement suggestion.
3. Keep the response under 150 words.
4. Do not give generic motivational advice.
5. Mention habit names when possible.
`;

    const insights = await generateInsights(prompt);

    res.json({
        insights
    });

}

module.exports = {
    getInsights
};