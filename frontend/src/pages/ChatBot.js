import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi there! I'm your travel assistant. I can help you discover great destinations based on your preferences. What kind of trip are you looking for?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [suggestions, setSuggestions] = useState([
    'Beach vacation', 
    'City exploration', 
    'Mountain retreat'
  ]);
  const [preferences, setPreferences] = useState([]);
  
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;
    
    // Add user message to chat
    const userMessage = { id: messages.length + 1, text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    try {
      // Call the backend API
      const response = await axios.post('http://localhost:8000/api/chatbot/message', {
        message: input,
        conversation_id: conversationId
      });
      
      // Process the response from the backend
      const { response: botText, conversation_id, suggestions: botSuggestions } = response.data;
      
      // Add bot response to chat
      const botResponse = { 
        id: messages.length + 2, 
        text: botText, 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, botResponse]);
      
      // Update conversation ID from backend
      if (conversation_id) {
        setConversationId(conversation_id);
      }
      
      // Update suggestions if provided by backend
      if (botSuggestions && botSuggestions.length > 0) {
        setSuggestions(botSuggestions);
      }
      
      // Continue to collect preferences for travel ideas generation
      collectPreferences(input);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        id: messages.length + 2, 
        text: "Sorry, I'm having trouble connecting. Please try again.", 
        sender: 'bot' 
      }]);
    }
  };

  // Simple bot response logic (would be handled by backend in real app)
  const getBotResponse = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('beach') || msg.includes('ocean') || msg.includes('sea')) {
      return "Beach destinations are wonderful! Do you prefer tropical islands or coastal cities?";
    } else if (msg.includes('mountain') || msg.includes('hiking') || msg.includes('nature')) {
      return "Nature and mountains sound great! Are you interested in hiking, skiing, or just enjoying scenic views?";
    } else if (msg.includes('city') || msg.includes('urban') || msg.includes('culture')) {
      return "City exploration is exciting! Are you interested in museums, food, architecture, or nightlife?";
    } else if (msg.includes('food') || msg.includes('cuisine') || msg.includes('eat')) {
      return "A culinary adventure! Which cuisines are you most interested in exploring?";
    } else if (msg.includes('budget') || msg.includes('cheap') || msg.includes('expensive')) {
      return "What's your approximate budget range for this trip? This helps me suggest suitable destinations.";
    } else if (msg.includes('when') || msg.includes('month') || msg.includes('season')) {
      return "When are you planning to travel? Different destinations are better at different times of the year.";
    } else if (preferences.length >= 3) {
      return "I think I have a good understanding of what you're looking for. Would you like me to suggest some destinations based on our conversation?";
    } else {
      return "Tell me more about what you're looking for in your trip. What activities do you enjoy when traveling?";
    }
  };
  
  // Update chat suggestions based on conversation context
  const updateSuggestions = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('beach') || msg.includes('ocean')) {
      setSuggestions(['Tropical islands', 'Mediterranean', 'Southeast Asia']);
    } else if (msg.includes('mountain') || msg.includes('hiking')) {
      setSuggestions(['Alps', 'Rocky Mountains', 'Patagonia']);
    } else if (msg.includes('city') || msg.includes('culture')) {
      setSuggestions(['Museums and art', 'Historical sites', 'Local cuisine']);
    } else if (msg.includes('food')) {
      setSuggestions(['Italian cuisine', 'Asian street food', 'Fine dining']);
    } else if (preferences.length >= 3) {
      setSuggestions(['Yes, suggest destinations', 'Add more preferences', 'Start over']);
    } else {
      setSuggestions(['Budget considerations', 'Time of year', 'Travel companions']);
    }
  };
  
  // Collect preferences from user messages
  const collectPreferences = (message) => {
    const msg = message.toLowerCase();
    const newPreferences = [...preferences];
    
    // Simple preference extraction (would be more sophisticated in real app)
    if (msg.includes('beach') && !preferences.includes('beaches')) {
      newPreferences.push('beaches');
    }
    if (msg.includes('mountain') && !preferences.includes('mountains')) {
      newPreferences.push('mountains');
    }
    if (msg.includes('food') && !preferences.includes('culinary')) {
      newPreferences.push('culinary');
    }
    if (msg.includes('museum') && !preferences.includes('cultural')) {
      newPreferences.push('cultural');
    }
    if (msg.includes('hiking') && !preferences.includes('adventure')) {
      newPreferences.push('adventure');
    }
    if (msg.includes('relax') && !preferences.includes('relaxation')) {
      newPreferences.push('relaxation');
    }
    
    if (newPreferences.length > preferences.length) {
      setPreferences(newPreferences);
    }
    
    // Note: Travel ideas functionality has been removed
    // Now all suggestions are handled through the normal chat flow
  };
  
  // Note: Travel ideas generation has been removed
  // All travel suggestions now come through the regular chat interface
  
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    // Automatically send the message when a suggestion is clicked
    setTimeout(() => handleSendMessage(), 100);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  const createItinerary = (destination) => {
    // In a real app, this would navigate to the itinerary form with the selected destination
    navigate('/itinerary', { state: { destination: destination } });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Travel Assistant</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Chat messages */}
        <div className="h-96 overflow-y-auto p-4 flex flex-col">
          {messages.map(message => (
            <div 
              key={message.id} 
              className={`${
                message.sender === 'user' 
                  ? 'chat-message-user ml-auto' 
                  : 'chat-message-bot mr-auto'
              }`}
            >
              {message.sender === 'user' ? (
                message.text
              ) : (
                <div className="whitespace-pre-line">
                  {message.text.split('**').map((part, index) => {
                    // Every odd index is wrapped in bold tags
                    return index % 2 === 0 ? (
                      <span key={index}>{part}</span>
                    ) : (
                      <strong key={index}>{part}</strong>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Suggestions */}
        <div className="px-4 py-2 bg-gray-100 flex flex-wrap gap-2">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
        
        {/* Input area */}
        <div className="p-4 border-t border-gray-200 flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-grow px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatBot;
