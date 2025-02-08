import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const LandingPage = () => {
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        socket.on("ai-feedback", (data) => {
            setFeedback(data.message);
        });

        return () => socket.off("ai-feedback");
    }, []);

    const sendAudioData = () => {
        socket.emit("audio-data", { audio: "sample-audio-data" });
    };

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">

            {/* Main Content */}
            <div className="flex flex-col items-center justify-center flex-grow text-center px-6">
                <h2 className="text-4xl font-bold text-gray-800 mt-12">Improve Your Presentations in Real Time</h2>
                <p className="text-gray-600 mt-4 text-lg">
                    AI-driven feedback to help you speak more clearly, confidently, and effectively.
                </p>
                <button 
                    onClick={sendAudioData} 
                    className="bg-blue-600 text-white px-6 py-3 mt-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                    Send Sample Audio
                </button>

                {/* Feedback Message */}
                {feedback && (
                    <div className="bg-white mt-6 p-4 rounded-lg shadow-md border border-gray-300 w-96 text-lg">
                        <strong>AI Feedback:</strong> {feedback}
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-gray-800 text-white text-center py-4 mt-10">
                <p>© 2025 Presenter.ai - All Rights Reserved</p>
            </footer>
        </div>
    );
};

export default LandingPage;
