import React, { useState } from "react";
import Button from "../components/Button";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

const PrepPage = () => {
  const [summary, setSummary] = useState("");
  const [volume, setVolume] = useState(60); // Default: 60dB (normal conversation)
  const [speed, setSpeed] = useState(150); // Default: 150 WPM (average speaking rate)

  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };

  const handleVolumeChange = (e) => {
    setVolume(parseInt(e.target.value));
  };

  const handleSpeedChange = (e) => {
    setSpeed(parseInt(e.target.value));
  };

  // Emit summary, volume, and speed settings to the backend
  const handleButtonClick = () => {
    socket.emit("speechSettings", { summary, volume, speed });
    console.log("Settings sent to server:", { summary, volume, speed });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Prepare Your Speech</h1>

      {/* Summary TextBox */}
      <textarea
        className="p-4 border border-gray-300 rounded-md w-full max-w-xl h-40 mb-6"
        placeholder="Write a summary of your speech here..."
        value={summary}
        onChange={handleSummaryChange}
      />

      {/* Volume Slider (in Decibels) */}
      <div className="mb-4 w-full max-w-xl">
        <label className="text-lg text-gray-700">Volume: {volume} dB</label>
        <input
          type="range"
          min="30"
          max="90"
          step="1"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>30dB (Whisper)</span>
          <span>60dB (Conversation)</span>
          <span>90dB (Shouting)</span>
        </div>
      </div>

      {/* Speed Slider (Words Per Minute) */}
      <div className="mb-6 w-full max-w-xl">
        <label className="text-lg text-gray-700">Speed: {speed} WPM</label>
        <input
          type="range"
          min="100"
          max="200"
          step="5"
          value={speed}
          onChange={handleSpeedChange}
          className="w-full cursor-pointer"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>100 WPM (Slow)</span>
          <span>150 WPM (Average)</span>
          <span>200 WPM (Fast)</span>
        </div>
      </div>

      {/* Proceed Button */}
      <Button to="/working" text="Proceed to Working Page" onClick={handleButtonClick} />
    </div>
  );
};

export default PrepPage;
