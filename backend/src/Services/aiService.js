import {
    GoogleGenerativeAI
} from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config()

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAi.getGenerativeModel({
    model: "gemini-2.0-flash-thinking-exp-01-21"
});

const aiService = {
    prompt: (question) => {
        const p = {
            "contents": [{
                "parts": [{
                    "text": question
                }]
            }]
        }

        const result = model.generateContent(p, {
            timeout: 60000
        })
        return result.response;
    },
    analysePrompt: () => {

    },
    sinthetizePrompt: () => {

    }
};

export default aiService