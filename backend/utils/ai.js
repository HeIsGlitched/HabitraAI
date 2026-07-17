const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function generateInsights(prompt){

    try{

        const response = await ai.models.generateContent({

            model: "models/gemini-3-flash-preview",

            contents: prompt

        });

        console.log(response);

        return response.text;

    }

    catch(error){

        console.error(error);

        throw error;

    }

}

module.exports = generateInsights;