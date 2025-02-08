const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { OpenAI } = require('openai');
require('dotenv').config(); // Load API Key securely

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

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Function to analyze speech using OpenAI's streaming API
const analyzeSpeech = async (speechText, summaryText, socket) => {
    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an expert speech coach analyzing pacing, filler words, and clarity." },
                { role: "user", content: `Analyze this speech and provide feedback on pacing, filler words, and clarity. The presentation summary is as follows: "${summaryText}". The speech is: "${speechText}"` }
            ],
            stream: true, // Enable streaming for faster feedback
        });

        // Send data to the client in chunks
        for await (const part of stream) {
            socket.emit('feedback', { feedback: part.choices[0]?.delta?.content || '' });
        }
    } catch (error) {
        console.error("Error analyzing speech:", error.message);
        socket.emit('feedback', { feedback: "Error analyzing speech." });
    }
};

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('speech', async (data) => {
        const { text: speechText, summary: summaryText } = data;
        if (!speechText || !summaryText) {
            socket.emit('feedback', { feedback: "Invalid input: Speech and summary required." });
            return;
        }
        analyzeSpeech(speechText, summaryText, socket);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
