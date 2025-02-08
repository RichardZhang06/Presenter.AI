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
const openai = new OpenAI({ apiKey: 'keyhere' });

// Initialize userSessions object
const userSessions = {}; 

// Function to analyze speech using ChatGPT
const analyzeSpeech = async (sentence, summaryText) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { 
                    role: "system", 
                    content: "You are an expert speech coach. Provide brief, actionable feedback on pacing, filler words, and clarity for the given sentence. Keep your feedback clear, concise, and easy for the presenter to understand quickly (maximum of 10 words per category)." 
                },
                { 
                    role: "user", 
                    content: `Analyze this sentence for pacing, filler words, and clarity: ${sentence}` 
                },
                { 
                    role: "system", 
                    content: `Summary of the presentation: ${summaryText}` 
                }
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
    
    // Initialize session with default settings
    userSessions[socket.id] = { 
        summary: "", 
        volume: 60,  // Default volume in dB (normal conversation)
        speed: 150,  // Default speed in WPM (average)
        previousSentences: [] 
    };

    // Handle summary input
    socket.on('summary', (summaryText) => {
        userSessions[socket.id].summary = summaryText;
        console.log(`Summary received for user ${socket.id}:`, summaryText);
    });

    // Handle speech settings (volume & speed)
    socket.on('speechSettings', ({ summary, volume, speed }) => {
        userSessions[socket.id].summary = summary;
        userSessions[socket.id].volume = volume;
        userSessions[socket.id].speed = speed;

        console.log(`Settings received for user ${socket.id}:`, { summary, volume, speed });
    });

    // Handle speech input for analysis
    socket.on('speech', async (sentence) => {
        const session = userSessions[socket.id];

        if (!session) {
            console.log(`No session found for user ${socket.id}`);
            return;
        }

        session.previousSentences.push(sentence);
        
        // Optionally limit to last 5 sentences for context
        if (session.previousSentences.length > 5) {
            session.previousSentences.shift();
        }

        const feedback = await analyzeSpeech(sentence, session.summary);

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
