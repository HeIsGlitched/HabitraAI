const generateInsights = require("../utils/ai");

async function getInsights(req, res){

    const result = await generateInsights(
        "Give me three tips for building habits."
    );

    res.json({
        insights: result
    });

}

module.exports = {
    getInsights
};