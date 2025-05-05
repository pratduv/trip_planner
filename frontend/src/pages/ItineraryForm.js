import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { itineraryService } from '../services/api';

const ItineraryForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get destination from location state if coming from chatbot
  const initialDestination = location.state?.destination || '';
  
  const [formData, setFormData] = useState({
    destination: initialDestination,
    duration: 3,
    budget: 1000,
    num_people: 2,
    preferences: [],
    start_date: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Set default start date to 30 days from now
  useEffect(() => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    setFormData(prev => ({
      ...prev,
      start_date: thirtyDaysFromNow.toISOString().split('T')[0] // Format as YYYY-MM-DD
    }));
  }, []);
  
  const preferenceOptions = [
    { value: 'nature', label: 'Nature & Outdoors' },
    { value: 'culture', label: 'Culture & History' },
    { value: 'food', label: 'Food & Dining' },
    { value: 'adventure', label: 'Adventure Activities' },
    { value: 'relaxation', label: 'Relaxation & Wellness' },
    { value: 'nightlife', label: 'Nightlife & Entertainment' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'family', label: 'Family-Friendly Activities' }
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePreferenceChange = (preference) => {
    setFormData(prev => {
      const updatedPreferences = prev.preferences.includes(preference)
        ? prev.preferences.filter(p => p !== preference)
        : [...prev.preferences, preference];
      
      return {
        ...prev,
        preferences: updatedPreferences
      };
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.preferences.length === 0) {
      setError("Please select at least one preference");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the backend API to generate the itinerary
      const response = await itineraryService.generateItinerary(formData);
      
      // Navigate to result page with the generated itinerary
      navigate('/itinerary/result', { state: { itinerary: response } });
      
    } catch (err) {
      setError("Error generating itinerary. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Create Your Travel Itinerary</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2" htmlFor="destination">
            Destination
          </label>
          <input
            type="text"
            id="destination"
            name="destination"
            value={formData.destination}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Paris, Tokyo, New York"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="duration">
              Duration (days)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              max="30"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="start_date">
              Start Date
            </label>
            <input
              type="date"
              id="start_date"
              name="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="budget">
              Total Budget ($)
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              min="100"
              step="100"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="num_people">
              Number of People
            </label>
            <input
              type="number"
              id="num_people"
              name="num_people"
              value={formData.num_people}
              onChange={handleInputChange}
              min="1"
              max="20"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Preferences (select at least one)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {preferenceOptions.map(option => (
              <div key={option.value} className="flex items-center">
                <input
                  type="checkbox"
                  id={`pref-${option.value}`}
                  checked={formData.preferences.includes(option.value)}
                  onChange={() => handlePreferenceChange(option.value)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={`pref-${option.value}`} className="ml-2 text-gray-700">
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors disabled:bg-blue-400"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-5 w-5 border-t-2 border-b-2 border-white rounded-full"></div>
                Generating Itinerary...
              </div>
            ) : (
              'Generate Itinerary'
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Tips for Planning</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>Consider the season when planning your trip - some destinations are better visited during specific times of year.</li>
          <li>For budget planning, remember to account for flights, accommodations, food, activities, and transportation.</li>
          <li>Research visa requirements for your destination well in advance.</li>
          <li>Check if there are any local festivals or events during your planned dates.</li>
        </ul>
      </div>
    </div>
  );
};

export default ItineraryForm;
