import React, { useState, useEffect } from "react";

function WorkingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [text, setText] = useState(""); // Optional field for additional text input
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);

  // Start recording function
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      setChunks((prevChunks) => [...prevChunks, e.data]);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/wav" });
      const url = URL.createObjectURL(blob);
      setAudioBlob(blob);
      setAudioURL(url);
    };

    recorder.start();
    setIsRecording(true);
    setMediaRecorder(recorder);
  };

  // Stop recording function
  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
  };

  useEffect(() => {
    return () => {
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
      }
    };
  }, [mediaRecorder]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Audio Recorder</h2>
        
        {/* Record/Stop Button */}
        <div className="mb-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
        </div>

        {/* Audio Playback */}
        {audioURL && (
          <div className="mb-4">
            <audio controls src={audioURL} className="w-full"></audio>
          </div>
        )}

        {/* Text Area for Additional Input */}
        <div className="mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter some text..."
            className="w-full p-2 border rounded-md"
          />
        </div>

        {/* Feedback Button (if any backend integration is required) */}
        <div className="mt-6">
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-green-700 transition duration-300">
            Get Feedback
          </button>
        </div>
      </div>
    </div>
  );
}

export default WorkingPage;
