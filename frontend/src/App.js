import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import AboutPage from "./pages/AboutPage";
import Speech from "./pages/SpeechTest";
import Navbar from "./components/Navbar";

const App = () => {
    return (
        <Router>
            {/* Navigation */}
            <Navbar />

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
