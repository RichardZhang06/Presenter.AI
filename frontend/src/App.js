import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import Speech from "./pages/SpeechTest";

const App = () => {
    return (
        <Router>
            {/* Navigation Bar */}
            <nav className="bg-blue-500 p-4 text-white flex justify-center space-x-6">
                <Link to="/" className="px-4 py-2 rounded hover:bg-blue-700 transition">Landing Page</Link>
                <Link to="/home" className="px-4 py-2 rounded hover:bg-blue-700 transition">Home Page</Link>
                <Link to="/speech" className="px-4 py-2 rounded hover:bg-blue-700 transition">Speech Test</Link>
                <Link to="/about" className="px-4 py-2 rounded hover:bg-blue-700 transition">About</Link>
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/speech" element={<Speech />} />
            </Routes>
        </Router>
    );
};

export default App;
