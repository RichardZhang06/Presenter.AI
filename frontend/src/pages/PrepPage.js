// src/pages/PrepPage.js
import React from 'react';
import Button from '../components/Button';

const PrepPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-4xl font-bold text-gray-800">Welcome to the Prep Page!</h2>
      <p className="text-lg text-gray-600 mt-4">Get ready to start working on your presentation.</p>

      <Button to="/working" text="Go to Working Page" />
    </div>
  );
};

export default PrepPage;
