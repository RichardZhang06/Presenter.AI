import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow text-center px-6">
        <h1 className="text-4xl font-bold text-gray-800 mt-12">Welcome to Presenter.AI</h1>
        <p className="text-lg text-gray-600 mt-4">
          Enhance your presentation skills with real-time AI-driven feedback.
        </p>
        <p className="text-gray-600 mt-2 mb-6">
          Get insights on your pacing, clarity, and delivery to become a better speaker!
        </p>

        {/* Call-to-Action Button */}
        <Link 
          to="/prep" 
          className="bg-blue-600 text-white px-6 py-3 mt-6 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
