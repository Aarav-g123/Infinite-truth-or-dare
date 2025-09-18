const express = require('express');
const { OpenAI } = require('openai');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('.'));

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate-question', async (req, res) => {
    try {
        const { type, context } = req.body;
        
        const prompt = `Generate a ${type} question for a Truth or Dare game. ${context || ''} Make it fun and appropriate for various age groups.`;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a creative Truth or Dare game AI. Generate engaging, appropriate questions and dares."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 100,
            temperature: 0.8
        });

        const question = completion.choices[0].message.content.trim();
        res.json({ question, type: 'ai' });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Failed to generate question' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});