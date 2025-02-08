import React, { useState } from "react";
import Button from "../components/Button";

const PrepPage = () => {
  const [summary, setSummary] = useState("");
  const [volume, setVolume] = useState(50); // Default volume: 50%
  const [speed, setSpeed] = useState(1); // Default speed: 1 (normal speed)

  const handleSummaryChange = (e) => {
    setSummary(e.target.value);
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
  };

  const handleSpeedChange = (e) => {
    setSpeed(e.target.value);
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

      {/* Volume Slider */}
      <div className="mb-4">
        <label className="text-lg text-gray-700">Volume: {volume}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full"
        />
      </div>

      {/* Speed Slider */}
      <div className="mb-6">
        <label className="text-lg text-gray-700">Speed: {speed}x</label>
        <input
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={speed}
          onChange={handleSpeedChange}
          className="w-full"
        />
      </div>

      {/* Button to Proceed to Working Page */}
      <Button to="/working" text="Proceed to Working Page" />
    </div>
  );
};

export default PrepPage;
