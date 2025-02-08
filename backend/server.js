const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());

// WebSocket connection
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("audio-data", (data) => {
        console.log("Received audio data:", data);

        // Process audio with AI (placeholder)
        const feedback = { message: "Slow down your speech" };

        // Send feedback back to frontend
        socket.emit("ai-feedback", feedback);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));

