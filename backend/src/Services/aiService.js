const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEYY);
const model = genAi.getGenerativeModel({
    model: "gemini-2.0-flash"
});

const aiService = {
    prompt: async (question) => {
        const p = {
            "contents": [{
                "parts": [{
                    "text": question
                }]
            }]
        }
        
        const result = await model.generateContent(p, {
            timeout: 60000
        });
        
        return result.response;
    },
    analysePrompt: () => {},
    sinthetizePrompt: () => {}
};

module.exports = aiService;