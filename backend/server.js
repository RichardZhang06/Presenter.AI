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

// Hardcode your OpenAI API Key
const openai = new OpenAI({ apiKey: 'paste-API-key-here' });

// Function to analyze speech using ChatGPT
const analyzeSpeech = async (speechText, summaryText) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: "You are an expert speech coach analyzing pacing, filler words, and clarity." },
                { role: "user", content: `Analyze this speech and provide feedback on pacing, filler words, and clarity. The presentation summary is as follows: "${summaryText}". The speech is: "${speechText}"` }
            ],
        });

        // Log the full GPT response to the console
        console.log('GPT Response:', response);

        // Return the analysis feedback
        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error analyzing speech:", error);
        return "Error analyzing speech.";
    }
};

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('speech', async (data) => {
        const { text: speechText, summary: summaryText } = data;
        const feedback = await analyzeSpeech(speechText, summaryText);
        socket.emit('feedback', { feedback });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
