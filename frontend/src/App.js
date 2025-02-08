import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import Speech from "./pages/SpeechTest"

const App = () => {
    return (
        <Router>
            {/* Navigation Bar */}
            <nav className="bg-blue-500 p-4 text-white flex space-x-4">
                <div className="flex items-center justify-center min-h-screen">
                    <Link to="/" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700">Landing Page</Link>
                </div>
                <Link to="/home" className="hover:underline">Home Page</Link>
                <div className="flex items-center justify-center min-h-screen">
                    <Link to="/Speech" className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700">Speech Test</Link>
                </div>
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/Speech" element={<Speech />} />
            </Routes>
        </Router>
    );
};

export default App;
