const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const callGroqAPI = async (systemPrompt, userPrompt, jsonFormat = true) => {
    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.1-8b-instant',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                response_format: jsonFormat ? { type: 'json_object' } : undefined,
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const content = response.data.choices[0].message.content;
        return jsonFormat ? JSON.parse(content) : content;
    } catch (error) {
        console.error('Error calling Groq API:', error.response?.data || error.message);
        throw new Error(JSON.stringify(error.response?.data || { message: error.message }));
    }
};

const MAIN_SYSTEM_PROMPT = "You are a brutally honest startup advisor. You do NOT sugarcoat. You identify real risks, flaws, and weaknesses. You think like an investor who wants to avoid bad ideas. Respond strictly in valid JSON format matching the requested schema.";

const ROAST_SYSTEM_PROMPT = "You are a sarcastic but intelligent startup critic. Be funny, sharp, and insightful. Do not be abusive. Respond strictly in valid JSON format matching the requested schema.";

const toolHandlers = {
    analyze_idea: async (idea) => {
        const userPrompt = `Analyze the following idea and provide a strict JSON response. Idea: "${idea}". 
        Schema required: { "viability_score": number (0-100), "risks": [array of strings], "competition": string, "uniqueness": string, "summary": string }`;
        return await callGroqAPI(MAIN_SYSTEM_PROMPT, userPrompt, true);
    },
    
    break_idea: async (idea) => {
        const userPrompt = `Critique the following idea by finding all its breaking points. Provide a strict JSON response. Idea: "${idea}".
        Schema required: { "failure_reasons": [array of strings], "wrong_assumptions": [array of strings], "edge_cases": [array of strings] }`;
        return await callGroqAPI(MAIN_SYSTEM_PROMPT, userPrompt, true);
    },

    improve_idea: async (idea) => {
        const userPrompt = `Suggest improvements for the following idea. Provide a strict JSON response. Idea: "${idea}".
        Schema required: { "improved_version": string, "niche": string, "monetization": string, "roadmap": [array of step-by-step strings] }`;
        return await callGroqAPI(MAIN_SYSTEM_PROMPT, userPrompt, true);
    },

    roast_idea: async (idea) => {
        const userPrompt = `Roast this startup idea. Be funny, sharp and insightful. Provide a strict JSON response. Idea: "${idea}".
        Schema required: { "roast": string }`;
        return await callGroqAPI(ROAST_SYSTEM_PROMPT, userPrompt, true);
    }
};

module.exports = {
    toolHandlers
};
