const getAIAnalysis = async (title, description, industry, genAI) => {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite" // SAME AS CHATBOT
        });

        const prompt = `
            You are a senior venture capitalist.

            Evaluate this startup idea critically.

            Startup:
            Title: ${title}
            Industry: ${industry}
            Description: ${description}

            Return STRICT JSON only:
            {
            "score": 0-100,
            "feedback": "3 sentence critique",
            "suggestions": ["idea 1", "idea 2", "idea 3"]
            }
            `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // 🔥 SAFETY CLEAN
        const json = JSON.parse(text.replace(/```json|```/g, "").trim());
        return json;

    } catch (err) {
        console.error("❌ Pitch AI Error:", err.message);
        throw err; // important
    }
};

module.exports = { getAIAnalysis };
