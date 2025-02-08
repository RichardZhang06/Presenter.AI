import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import SpeechPage from "./pages/SpeechPage";
import PrepPage from "./pages/PrepPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
const App = () => {
    return (
        <Router>
            {/* Navigation */}
            <Navbar />

            {/* Page Content */}
            <div className="container mx-auto p-6">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/speech" element={<SpeechPage />} />
                    <Route path="/prep" element={<PrepPage />} />
                </Routes>
            </div>

            {/* Footer */}
            <Footer />
        </Router>
    );
};

export default App;
