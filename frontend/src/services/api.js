import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// API services for chatbot
export const chatbotService = {
  sendMessage: async (message, conversationId = null) => {
    try {
      const response = await api.post('/api/chatbot/message', { message, conversation_id: conversationId });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  
  getTravelIdeas: async (preferences, timeline, budget_range, travelers) => {
    try {
      const response = await api.post('/api/chatbot/ideas', {
        preferences,
        timeline,
        budget_range,
        travelers
      });
      return response.data;
    } catch (error) {
      console.error('Error getting travel ideas:', error);
      throw error;
    }
  }
};

// API services for itinerary
export const itineraryService = {
  generateItinerary: async (itineraryData) => {
    try {
      const response = await api.post('/api/itinerary/generate', itineraryData);
      return response.data;
    } catch (error) {
      console.error('Error generating itinerary:', error);
      throw error;
    }
  }
};

export default api;
