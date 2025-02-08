import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

function WorkingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const [feedback, setFeedback] = useState("");

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

  // Start speech recognition
  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Stop speech recognition and send to the backend
  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);

      // Emit the speech to backend for analysis once listening stops
      socket.emit("speech", transcript, "Your speech summary here"); // Add summary if needed
    }
  };

  // Listen for feedback from backend
  useEffect(() => {
    socket.on("feedback", (data) => {
      setFeedback(data.feedback);
    });
    
    return () => {
      socket.off("feedback");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Audio and Speech Recognition</h2>

        {/* Record/Stop Button */}
        <div className="mb-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
        </div>

        {/* Transcript */}
        <div className="mb-4">
          <p className="text-lg bg-gray-100 p-4 rounded shadow">
            {transcript || "Your speech will appear here..."}
          </p>
        </div>

        {/* Feedback */}
        <div className="mt-4">
          {feedback && (
            <div className="bg-green-100 p-4 rounded-lg">
              <h3 className="font-bold">Feedback:</h3>
              <p>{feedback}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default WorkingPage;
