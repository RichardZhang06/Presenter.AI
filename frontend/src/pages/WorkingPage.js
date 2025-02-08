import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

function WorkingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speechSpeed, setSpeechSpeed] = useState(0); // Words per minute
  const [speechVolume, setSpeechVolume] = useState(0); // Volume level (in decibels)
  const [feedback, setFeedback] = useState("");

  const recognitionRef = useRef(null); // To keep reference to recognition
  const mediaStreamRef = useRef(null); // To hold reference to the audio stream for volume monitoring
  const analyserRef = useRef(null); // For audio analyser node
  const audioContextRef = useRef(null); // For audio context
  const wordCountRef = useRef(0); // To count words
  const startTimeRef = useRef(0); // To store the start time of recording

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

      // Count words in the transcript
      wordCountRef.current = newTranscript.split(" ").length;
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
      startTimeRef.current = Date.now(); // Store the start time when recording starts
    }
  };

  // Stop speech recognition and send to the backend
  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);

      // Calculate Words Per Minute (WPM) once recording stops
      const durationInMinutes = (Date.now() - startTimeRef.current) / 60000; // Duration in minutes
      const totalWords = wordCountRef.current;

      const wpm = totalWords / durationInMinutes; // Calculate WPM (words per minute)
      setSpeechSpeed(wpm); // Set WPM

      // Emit the speech to backend for analysis once listening stops
      socket.emit("speech", transcript, "Your speech summary here"); // Add summary if needed
    }
  };

  // Volume Monitoring with Web Audio API
  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          audioContextRef.current = audioContext;

          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          analyserRef.current = analyser;

          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          // Continuously monitor the volume level
          const getVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;

            setSpeechVolume(average); // Set the average volume

            // Continue monitoring every 100ms
            requestAnimationFrame(getVolume);
          };

          getVolume();
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err);
        });
    }

    // Cleanup on unmount or stop
    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording]);

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

        {/* Speech Speed */}
        <div className="mb-4">
          <p className="text-lg bg-gray-100 p-4 rounded shadow">
            Speech Speed: {Math.round(speechSpeed)} words per minute
          </p>
        </div>

        {/* Speech Volume */}
        <div className="mb-4">
          <p className="text-lg bg-gray-100 p-4 rounded shadow">
            Speech Volume: {Math.round(speechVolume)} dB
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
