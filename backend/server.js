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

// Initialize OpenAI
const openai = new OpenAI({ apiKey: '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' });

// Initialize userSessions object
const userSessions = {}; // <-- Add this line

// Function to analyze speech using ChatGPT
const analyzeSpeech = async (sentence, summaryText) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an expert speech coach analyzing pacing, filler words, and clarity." },
                { role: "user", content: `Analyze this speech: ${sentence}` },
                { role: "system", content: `Summary: ${summaryText}` }
            ],
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error analyzing speech:", error);
        return "Error analyzing speech.";
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

    socket.on('speech', async (speechText, summaryText) => {
        const session = userSessions[socket.id];
        session.previousSentences.push(speechText);
    
        // Optionally limit to last 5 sentences for context
        if (session.previousSentences.length > 5) {
            session.previousSentences.shift();
        }
    
        const feedback = await analyzeSpeech(speechText, summaryText); // Pass speechText and summaryText
    
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
