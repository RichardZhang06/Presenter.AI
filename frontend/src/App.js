import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";

const App = () => {
    return (
        <Router>
            {/* Navigation Bar */}
            <nav className="bg-blue-500 p-4 text-white flex space-x-4">
                <Link to="/" className="hover:underline">Landing Page</Link>
                <Link to="/home" className="hover:underline">Home Page</Link>
            </nav>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={<HomePage />} />
            </Routes>
        </Router>
    );
};

export default App;
