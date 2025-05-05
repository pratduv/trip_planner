import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">TripPlanner</Link>
        <div className="space-x-4">
          <Link to="/" className="hover:text-blue-200 transition-colors">Home</Link>
          <Link to="/chatbot" className="hover:text-blue-200 transition-colors">Travel Assistant</Link>
          <Link to="/itinerary" className="hover:text-blue-200 transition-colors">Create Itinerary</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
