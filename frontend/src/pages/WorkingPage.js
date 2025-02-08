import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

const socket = io("http://localhost:5001");

function WorkingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [speechSpeed, setSpeechSpeed] = useState(0);
  const [speechVolume, setSpeechVolume] = useState(0);
  const [feedback, setFeedback] = useState("");

  const recognitionRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const audioContextRef = useRef(null);
  const startTimeRef = useRef(0);
  const transcriptBufferRef = useRef("");

  const transcriptRef = useRef("");
  const interimTranscriptRef = useRef("");

  useEffect(() => {
    transcriptRef.current = transcript;
  }, [transcript]);

  useEffect(() => {
    interimTranscriptRef.current = interimTranscript;
  }, [interimTranscript]);

  const clearTranscript = () => {
    setTranscript("");
    setInterimTranscript("");
    transcriptBufferRef.current = "";
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Try Chrome or Edge.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalResult = "";
      let interimResult = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalResult += event.results[i][0].transcript;
        } else {
          interimResult += event.results[i][0].transcript;
        }
      }
      if (finalResult) {
        setTranscript((prevTranscript) => {
          const updatedTranscript = prevTranscript + " " + finalResult;
          transcriptBufferRef.current = updatedTranscript;
          return updatedTranscript;
        });
        setInterimTranscript("");
      }
      setInterimTranscript(interimResult);
    };

    recognition.onerror = (event) => {
      console.error("Speech Recognition Error:", event.error);
    };

    recognitionRef.current = recognition;
  }, []);

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      recognitionRef.current.start();
      setIsRecording(true);
      startTimeRef.current = Date.now();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      const elapsedTime = (Date.now() - startTimeRef.current) / 60000;
      const combinedText = (transcriptRef.current + " " + interimTranscriptRef.current).trim();
      const totalWords = combinedText ? combinedText.split(/\s+/).length : 0;
      const finalSpeed = elapsedTime > 0 ? totalWords / elapsedTime : 0;
      setSpeechSpeed(finalSpeed);
      socket.emit("speech", transcriptBufferRef.current, "Your speech summary here");
    }
  };

  useEffect(() => {
    if (isRecording) {
      const speedInterval = setInterval(() => {
        const combinedText = (transcriptRef.current + " " + interimTranscriptRef.current).trim();
        const words = combinedText ? combinedText.split(/\s+/).length : 0;
        const elapsedTime = (Date.now() - startTimeRef.current) / 60000;
        const speed = elapsedTime > 0 ? words / elapsedTime : 0;
        setSpeechSpeed(speed);
      }, 2000);
      return () => clearInterval(speedInterval);
    }
  }, [isRecording]);

  useEffect(() => {
    let audioContext = null;
    let volumeInterval = null;
    if (isRecording) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      audioContextRef.current = audioContext;
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaStreamRef.current = stream;
          const source = audioContext.createMediaStreamSource(stream);
          source.connect(analyser);

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateVolume = () => {
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < dataArray.length; i++) {
              sum += dataArray[i];
            }
            const average = sum / dataArray.length;
            setSpeechVolume(average);
          };

          updateVolume();
          volumeInterval = setInterval(updateVolume, 2000);
        })
        .catch((err) => {
          console.error("Error accessing microphone:", err);
        });
    }
    return () => {
      if (volumeInterval) {
        clearInterval(volumeInterval);
      }
      if (audioContext && audioContext.state !== "closed") {
        audioContext.close().catch((error) => {
          console.error("Error closing AudioContext:", error);
        });
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isRecording]);

  useEffect(() => {
    if (isRecording) {
      const intervalId = setInterval(() => {
        if (transcriptBufferRef.current.length > 0) {
          socket.emit("speech", transcriptBufferRef.current, "Your speech summary here");
          console.log("Sending content to backend:", transcriptBufferRef.current);
        }
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isRecording]);

  // Make sure to listen for feedback from the backend
  useEffect(() => {
    socket.on("feedback", (data) => {
      console.log("Received feedback:", data); // Debugging log
      setFeedback(data.feedback);
    });
    return () => {
      socket.off("feedback");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex flex-row gap-4">
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center mb-4">Recording</h2>
          <div className="mb-4 flex flex-col gap-2">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            <div className="flex gap-2">
              <button
                onClick={clearTranscript}
                className="flex-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="mb-4 h-40 overflow-auto">
            <p className="text-sm bg-gray-100 p-4 rounded shadow">
              {(transcript + " " + interimTranscript).trim() || "Your speech will appear here..."}
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg bg-gray-100 p-4 rounded shadow">
              Speech Speed: {Math.round(speechSpeed)} wpm
            </p>
          </div>
          <div className="mb-4">
            <p className="text-lg bg-gray-100 p-4 rounded shadow">
              Speech Volume: {Math.round(speechVolume)} dB
            </p>
          </div>
          {/* Move Back Button below the Speech Volume box */}
          <Link to="/prep">
            <button
              className="w-full py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition"
            >
              Back
            </button>
          </Link>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center mb-4">AI Feedback</h2>
          <div>
            <p className="text-sm bg-blue-100 p-4 rounded shadow">
              {feedback || "Waiting for feedback..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkingPage;
