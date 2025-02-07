import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const App = () => {
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        socket.on("ai-feedback", (data) => {
            setFeedback(data.message);
        });

        return () => socket.off("ai-feedback");
    }, []);

    const sendAudioData = () => {
        // Placeholder: In a real app, you'd send actual audio data
        socket.emit("audio-data", { audio: "sample-audio-data" });
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Presenter.ai</h1>
            <button onClick={sendAudioData}>Send Sample Audio</button>
            {feedback && <h2>AI Feedback: {feedback}</h2>}
        </div>
    );
};

export default App;

