import React from "react";

const AboutPage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">About Presenter.AI</h1>
            <p className="text-lg text-gray-700 max-w-2xl text-center">
                Presenter.AI is an AI-powered real-time speech coaching tool that provides live feedback on pacing, 
                filler words, and clarity. Our mission is to help speakers improve their delivery and confidence 
                through intelligent analysis.
            </p>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6">How It Works</h2>
            <ul className="list-disc text-gray-700 mt-2 text-lg">
                <li>Analyze speech in real-time using AI</li>
                <li>Detect filler words and pacing issues</li>
                <li>Provide instant, actionable feedback</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-800 mt-6">Our Vision</h2>
            <p className="text-lg text-gray-700 max-w-2xl text-center">
                We believe that great communication starts with great feedback. 
                With Presenter.AI, we empower speakers to refine their skills and deliver impactful presentations effortlessly.
            </p>
        </div>
    );
};

export default AboutPage;

