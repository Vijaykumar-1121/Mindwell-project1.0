const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');



const systemPrompt = `You are the MindWell Support Assistant. Your job is to help users navigate the MindWell mental health platform and answer their questions gracefully. 
CRITICAL RULES:
1. Keep your responses short and conversational (like a friendly text message). 
2. Be helpful and directly answer the user's question FIRST. 
3. Only if relevant, you may provide EXACT relative URLs when guiding users to features:
- Dashboard: [Dashboard](dashboard.html)
- Mood Tracker: [Mood Tracker](mood-tracker.html)
- Journal & Community: [Journal](journal.html)
- Appointments: [Appointments](appointments.html)
- Resources & Meditation: [Resources](resources.html)
- Voice AI: Let them know the Voice orb is on the dashboard page.
- Settings: [Settings](settings.html)
4. You are NOT a therapist. If someone seeks therapy, direct them to use the Appointments page or the Voice Orb on the dashboard.`;

router.post('/chat', async (req, res) => {
    try {
        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
            return res.status(500).json({ success: false, message: "Groq API Key is not configured on the server." });
        }
        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        const { messages } = req.body;
        
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ success: false, message: "Messages array is required." });
        }

        // Prepend system prompt to the conversation
        const fullConversation = [
            { role: "system", content: systemPrompt },
            ...messages
        ];

        const chatCompletion = await groq.chat.completions.create({
            messages: fullConversation,
            model: "llama-3.1-8b-instant", // Fast and effective open-source model available on Groq
            temperature: 0.7,
            max_tokens: 512,
        });

        res.json({ success: true, reply: chatCompletion.choices[0].message.content });
    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ success: false, message: "Failed to generate AI response." });
    }
});

router.post('/prompt', async (req, res) => {
    try {
        if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'YOUR_GROQ_API_KEY_HERE') {
            return res.status(500).json({ success: false, message: "Groq API Key is not configured." });
        }
        
        const { mood, tags } = req.body;
        if (!mood) {
            return res.status(400).json({ success: false, message: "Mood is required." });
        }

        const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
        
        const promptSystemMsg = `You are MindWell, a mental health AI assistant. The user is checking in to their mood tracker.
They selected a mood rating of ${mood} out of 5 (1=Awful, 5=Great).
They tagged the following factors influencing their mood: ${tags && tags.length ? tags.join(', ') : 'None'}.

Your task: Generate a SINGLE, short, empathetic, thought-provoking journaling question based on this input to inspire them to write in their notes. Do not include any greetings or extra text. Just the question.`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "system", content: promptSystemMsg }],
            model: "llama-3.1-8b-instant",
            temperature: 0.8,
            max_tokens: 150,
        });

        res.json({ success: true, prompt: chatCompletion.choices[0].message.content.trim() });
    } catch (error) {
        console.error("AI Prompt Error:", error);
        res.status(500).json({ success: false, message: "Failed to generate prompt." });
    }
});

module.exports = router;
