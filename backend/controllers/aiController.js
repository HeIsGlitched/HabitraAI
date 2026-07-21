const Habit = require("../models/Habit");
const generateInsights = require("../utils/ai");

async function getInsights(req, res){
    try{
        const habits = await Habit.find({
            user: req.userId
        });
        if (habits.length === 0) {

    return res.json({

        insights: `👋 Welcome to HabitraAI!

Create a few habits and complete them for a couple of days.

Once I have enough data, I'll start giving you personalized coaching based on your progress.`

    });

}
const habitSummary = habits.map(function(habit){

    return `
Habit: ${habit.name}
Current streak: ${habit.streak} days
Total completions: ${habit.completedDates.length}
`;

}).join("\n");

const prompt = `
You are the AI Coach inside HabitraAI, a habit tracking application.

Your job is to analyze the user's habits and provide short, actionable coaching.

Rules:

- Return exactly 3 insights.
- Start each insight with an appropriate emoji.
- Each insight must be exactly one sentence.
- Mention habit names whenever possible.
- Then provide exactly one coach tip starting with 💡.
- Do not use markdown.
- Do not use bullet points (- or *).
- Do not introduce yourself.
- Do not say "Based on your data" or similar phrases.
- Do not use motivational quotes.
- Keep the entire response under 100 words.

User Habits:

${habitSummary}
`;

    const insights = await generateInsights(prompt);

    res.json({
        insights
    });

    }

    catch (error) {

    console.error(error);

    if (error.status === 429) {
        return res.status(429).json({
            message: "⚠️ AI Coach is temporarily unavailable because the AI request limit has been reached. Please try again later."
        });
    }

    if (error.status === 503) {
        return res.status(503).json({
            message: "⚠️ AI Coach is temporarily unavailable because the AI service is busy. Please try again in a few minutes."
        });
    }

    return res.status(500).json({
        message: "❌ Failed to generate AI insights."
    });
}
}

module.exports = {
    getInsights
};