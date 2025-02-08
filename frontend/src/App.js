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
            <nav className="bg-blue-600 text-white shadow-md">
                <div className="container mx-auto flex justify-between items-center p-4">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold tracking-wide">Presenter.AI</Link>

                    {/* Navigation Links */}
                    <div className="flex space-x-6">
                        <Link to="/home" className="hover:text-gray-200 transition">Home</Link>
                        <Link to="/speech" className="hover:text-gray-200 transition">Speech Test</Link>
                        <Link to="/about" className="hover:text-gray-200 transition">About</Link>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            <div className="container mx-auto p-6">
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/speech" element={<Speech />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
