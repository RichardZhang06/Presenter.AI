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
    
    userSessions[socket.id] = { summary: "", previousSentences: [] };

    socket.on('summary', (summaryText) => {
        userSessions[socket.id].summary = summaryText;
        console.log(`Summary received for user ${socket.id}:`, summaryText);
    });

    socket.on('speech', async (sentence) => {
        const session = userSessions[socket.id];
        const summaryText = session.summary || "No summary provided.";
        session.previousSentences.push(sentence);

        // Optionally limit to last 5 sentences for context
        if (session.previousSentences.length > 5) {
            session.previousSentences.shift();
        }

        const feedback = await analyzeSpeechSentence(sentence, summaryText, session.previousSentences);
        
        if (feedback) {
            socket.emit('feedback', { feedback });
        }
    });

    socket.on('disconnect', () => {
        console.log(`User ${socket.id} disconnected`);
        delete userSessions[socket.id];
    });
});


const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});