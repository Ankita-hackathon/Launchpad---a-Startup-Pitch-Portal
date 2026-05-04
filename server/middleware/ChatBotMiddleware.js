require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai")


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const GenerateContent = async (description) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `
                        You are an expert startup investor and mentor. Analyze the following startup pitch. 
                        Give it a score out of 100 based on clarity, market potential, and feasibility. 
                        Provide constructive feedback.

                        Pitch Description:
                        "${description}"

                        Respond ONLY with a valid JSON object using this exact schema:
                        {
                            "score": <number between 0 and 100>,
                            "feedback": "<string with detailed feedback>"
                        }
                    `;

        const result = await model.generateContent(prompt);
        const aiResponseText = result.response.text();

        // This parses the string and returns the neat { score: 85, feedback: "..." } object
        return JSON.parse(aiResponseText);

    } catch (error) {
        console.error("Error generating AI content:", error);

        // Always return a safe fallback object so your app doesn't crash if the AI API times out
        return {
            score: 0,
            feedback: "AI analysis is currently unavailable. Please try again later."
        };
    }
};

const ChatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ reply: "Please provide a message." });

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
        const result = await model.generateContent(message);
        
        res.status(200).json({ reply: result.response.text() });
    } catch (error) {
        console.error("ChatBot error:", error);
        res.status(500).json({ reply: "I'm having trouble connecting right now." });
    }
};

module.exports = { GenerateContent, ChatWithAI }; 