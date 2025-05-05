import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import pages
import Home from './pages/Home';
import ChatBot from './pages/ChatBot';
import ItineraryForm from './pages/ItineraryForm';
import ItineraryResult from './pages/ItineraryResult';

// Import components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="App min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chatbot" element={<ChatBot />} />
            <Route path="/itinerary" element={<ItineraryForm />} />
            <Route path="/itinerary/result" element={<ItineraryResult />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
