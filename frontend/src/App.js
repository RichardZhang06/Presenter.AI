import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PrepPage from "./pages/PrepPage";
import AboutPage from "./pages/AboutPage";
import SpeechPage from "./pages/SpeechPage";
import WorkingPage from "./pages/WorkingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">

        {/* Navigation */}
        <Navbar />

        {/* Page Content */}
        <div className="container mx-auto p-6 flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/prep" element={<PrepPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/speech" element={<SpeechPage />} />
            <Route path="/working" element={<WorkingPage />} />
          </Routes>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;
