import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PrepPage from "./pages/PrepPage";
import AboutPage from "./pages/AboutPage";
import MicTest from "./pages/MicTest";
import WorkingPage from "./pages/WorkingPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AnimatedWaves from "./components/AnimatedWaves";



const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">

        {/* Water Waves Background */}
        <AnimatedWaves />

        {/* Navigation */}
        <Navbar />

        {/* Page Content */}
        <div className="container mx-auto p-6 flex-grow relative bg-blue-100 rounded-lg shadow-lg">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/prep" element={<PrepPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/mic" element={<MicTest />} />
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
