import React, { useEffect, useState, useRef } from "react";

function Speech() {
    const [transcript, setTranscript] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null); // To keep reference to recognition

    useEffect(() => {
        // Check if browser supports Web Speech API
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            alert("Your browser does not support Speech Recognition. Try Chrome or Edge.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
            let newTranscript = "";
            for (let i = 0; i < event.results.length; i++) {
                newTranscript += event.results[i][0].transcript;
            }
            setTranscript(newTranscript);
        };

        recognition.onerror = (event) => {
            console.error("Speech Recognition Error:", event.error);
        };

        recognitionRef.current = recognition; // Save recognition for later use
    }, []);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    return (
        <div className="p-4 text-center">
            <h1 className="text-2xl font-bold mb-4">Speech Recognition Demo</h1>
            
            <button
                onClick={startListening}
                className={`px-4 py-2 m-2 rounded ${isListening ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"} text-white`}
                disabled={isListening}
            >
                {isListening ? "Listening..." : "Start Listening"}
            </button>

            <button
                onClick={stopListening}
                className="px-4 py-2 m-2 rounded bg-red-500 hover:bg-red-600 text-white"
                disabled={!isListening}
            >
                Stop Listening
            </button>

            <p className="mt-4 text-lg bg-gray-100 p-4 rounded shadow">{transcript || "Your speech will appear here..."}</p>
        </div>
    );
}

export default Speech;
