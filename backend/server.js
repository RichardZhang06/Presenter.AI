const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: 'paste-API-key-here' });

// Optimized function to analyze speech
const analyzeSpeech = async (speechText, summaryText) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            temperature: 0.3,  // More concise and deterministic output
            max_tokens: 200,  // Prevent overly long responses
            messages: [
                { role: "system", content: "You are a speech coach analyzing pacing, filler words, and clarity. Give clear and direct feedback." },
                { role: "user", content: `Analyze this speech for pacing, filler words, and clarity. The presentation summary is: "${summaryText}". The speech is: "${speechText}"` }
            ],
        });

        return response.choices[0]?.message?.content || "No feedback available.";
    } catch (error) {
        console.error("OpenAI API Error:", error.response?.data || error.message);
        return "Error analyzing speech. Please try again.";
    }
};

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('speech', async (data, callback) => {
        const { text: speechText, summary: summaryText } = data;
        const feedback = await analyzeSpeech(speechText, summaryText);
        callback?.(feedback);  // Use callback for better performance
        socket.emit('feedback', { feedback });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
