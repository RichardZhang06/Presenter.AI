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
    
    userSessions[socket.id] = { summary: "", previousSentences: [] };

    socket.on('summary', (summaryText) => {
        userSessions[socket.id].summary = summaryText;
        console.log(`Summary received for user ${socket.id}:`, summaryText);
    });

    // Backend (server.js)
    socket.on('speech', async (sentence, summaryText) => {
        const session = userSessions[socket.id];
        session.previousSentences.push(sentence);
        
        // Optionally limit to last 5 sentences for context
        if (session.previousSentences.length > 5) {
            session.previousSentences.shift();
        }
        
        // Analyze the current sentence
        const feedback = await analyzeSpeech(sentence, summaryText); // Pass sentence and summaryText

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
