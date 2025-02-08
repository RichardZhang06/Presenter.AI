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

// Hardcode the OpenAI API Key directly in the code
const openai = new OpenAI({ apiKey: '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' });  // Replace with your actual API key

let userSessions = {}; // Initialize userSessions object

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
            if (socket && socket.emit) {
                socket.emit('feedback', { feedback: part.choices[0]?.delta?.content || '' });
            } else {
                console.error('socket.emit is not a function, check socket object');
            }
        }
    } catch (error) {
        console.error("Error analyzing speech:", error.message);
        if (socket && socket.emit) {
            socket.emit('feedback', { feedback: "Error analyzing speech." });
        }
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

        const feedback = await analyzeSpeech(sentence, summaryText, socket);  // Pass the socket object here
        
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
