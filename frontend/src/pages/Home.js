import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section py-20 px-4 text-center">
        <div className="container mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Plan Your Dream Trip</h1>
          <p className="text-xl mb-8">Personalized itineraries tailored to your preferences</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/chatbot" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Chat with Travel Assistant
            </Link>
            <Link to="/itinerary" className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-lg transition-colors">
              Create Itinerary
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-100">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-4xl mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Share Your Preferences</h3>
              <p className="text-gray-600">Tell us about your travel style, interests, and budget.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-4xl mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Get Destination Ideas</h3>
              <p className="text-gray-600">Discover perfect destinations based on your preferences.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-blue-600 text-4xl mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Create Your Itinerary</h3>
              <p className="text-gray-600">Generate a detailed day-by-day plan for your trip.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-600 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Planning?</h2>
          <p className="text-xl mb-8">Create your personalized travel itinerary in minutes.</p>
          <Link to="/itinerary" className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-8 rounded-lg transition-colors">
            Get Started
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
