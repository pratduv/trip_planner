# Trip Planner

This project is an AI-powered travel planning app. It features a chatbot that helps users plan their trips and generates personalized itineraries using OpenAI's GPT models.

## Project Structure

- `backend/` — FastAPI backend (Python)
  - Handles chatbot and itinerary generation using OpenAI
  - Expects an `.env` file with your OpenAI API key
- `frontend/` — React frontend (JavaScript)
  - User interface for chat, itinerary form, and results

## Prerequisites

- Python 3.11+
- Node.js (v16 or newer recommended)
- npm (comes with Node.js)

## Setup Instructions

### 1. Clone the repository and create a virtual environment
```bash
cd /Users/pratyushaduvvuri/Desktop/trip_planner
python -m venv venv
source venv/bin/activate
```

### 2. Install backend dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 3. Set your OpenAI API key
Edit `backend/.env` and add:
```
OPENAI_API_KEY=sk-...  # Your OpenAI API key
```

### 4. Install Uvicorn (if not already installed)
```bash
pip install uvicorn
```

### 5. Start the backend server
From the `backend` directory:
```bash
uvicorn app.main:app --reload
```
The API will be available at [http://localhost:8000](http://localhost:8000)

### 6. Install frontend dependencies
In a new terminal:
```bash
cd /Users/pratyushaduvvuri/Desktop/trip_planner/frontend
npm install
```

### 7. Start the frontend React app
```bash
npm start
```
The app will be available at [http://localhost:3000](http://localhost:3000)

## Troubleshooting
- If you see `zsh: command not found: uvicorn`, install it with `pip install uvicorn` in your virtual environment.
- Make sure your virtual environment is activated (`source venv/bin/activate`).
- If you see missing files in the frontend, ensure `frontend/public/index.html` exists (it should now).

## Usage
- Open [http://localhost:3000](http://localhost:3000) in your browser.
- Use the chatbot to get travel ideas or go directly to the itinerary form to generate a trip plan.

---

**Enjoy your trip planning!**
