import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ItineraryResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itinerary: receivedItinerary, formData } = location.state || {};
  
  const [itinerary, setItinerary] = useState(null);
  const [isLoading, setIsLoading] = useState(!receivedItinerary);
  const [error, setError] = useState(null);
  const [activeDay, setActiveDay] = useState(1);
  
  useEffect(() => {
    // If we already have the itinerary from the previous page, use it
    if (receivedItinerary) {
      setItinerary(receivedItinerary);
      setIsLoading(false);
      return;
    }
    
    // If we don't have form data or itinerary, redirect to the form
    if (!formData) {
      navigate('/itinerary');
      return;
    }
  }, [receivedItinerary, formData, navigate]);
  

  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin mx-auto h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
        <p className="mt-4 text-xl">Generating your personalized itinerary...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/itinerary')} 
            className="mt-4 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  const currentDay = itinerary.days.find(day => day.day === activeDay) || itinerary.days[0];
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="bg-blue-600 text-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold">{itinerary.destination} Itinerary</h1>
        <p className="text-xl mt-2">{itinerary.summary}</p>
        <div className="flex flex-wrap items-center justify-between mt-4">
          <div className="mr-8 mb-2">
            <span className="opacity-80">Duration:</span> {itinerary.duration} days
          </div>
          <div className="mr-8 mb-2">
            <span className="opacity-80">Total Cost:</span> {formatCurrency(itinerary.total_cost)}
          </div>
          <div className="mb-2">
            <span className="opacity-80">Dates:</span> {formatDate(itinerary.days[0].date)} - {formatDate(itinerary.days[itinerary.days.length - 1].date)}
          </div>
        </div>
      </div>
      
      {/* Day selector */}
      <div className="mb-6 overflow-x-auto">
        <div className="flex space-x-2 min-w-max">
          {itinerary.days.map(day => (
            <button
              key={day.day}
              onClick={() => setActiveDay(day.day)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeDay === day.day 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
            >
              Day {day.day}
            </button>
          ))}
        </div>
      </div>
      
      {/* Current day details */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h2 className="text-2xl font-bold">Day {currentDay.day}: {formatDate(currentDay.date)}</h2>
        </div>
        
        <div className="p-6">
          {/* Activities */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Activities</h3>
            <div className="space-y-4">
              {currentDay.activities.map((activity, index) => (
                <div key={index} className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold">{activity.name}</h4>
                      <p className="text-gray-600">{activity.time} • {activity.duration}</p>
                      <p className="mt-2">{activity.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{activity.type}</span>
                      <p className="font-semibold mt-2">{formatCurrency(activity.cost)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Meals */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Meals</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentDay.meals.map((meal, index) => (
                <div key={index} className="bg-green-50 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-bold">{meal.type}</h4>
                      <p>{meal.name}</p>
                    </div>
                    <p className="font-semibold">{formatCurrency(meal.cost)}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Accommodation */}
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Accommodation</h3>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-bold">{currentDay.accommodation.name}</h4>
                  <p className="text-gray-600">{currentDay.accommodation.address}</p>
                  <div className="mt-1 flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{currentDay.accommodation.rating}/5</span>
                  </div>
                </div>
                <p className="font-semibold">{formatCurrency(currentDay.accommodation.cost)}</p>
              </div>
            </div>
          </section>
          
          {/* Transportation */}
          <section>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">Transportation</h3>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex justify-between">
                <div>
                  <h4 className="font-bold">{currentDay.transportation.type}</h4>
                  <p className="text-gray-600">For getting around {itinerary.destination}</p>
                </div>
                <p className="font-semibold">{formatCurrency(currentDay.transportation.cost)}</p>
              </div>
            </div>
          </section>
        </div>
      </div>
      
      {/* Tips */}
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Travel Tips</h3>
        <ul className="list-disc pl-5 space-y-2">
          {itinerary.tips.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
      
      {/* Actions */}
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <button 
          onClick={() => window.print()} 
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Print Itinerary
        </button>
        <button 
          onClick={() => navigate('/itinerary')} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Create Another Itinerary
        </button>
      </div>
    </div>
  );
};

export default ItineraryResult;
