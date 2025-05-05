from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Trip Planner API", description="API for generating travel itineraries")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the Trip Planner API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Import and include routers
from app.api.itinerary import router as itinerary_router
from app.api.chatbot import router as chatbot_router

app.include_router(itinerary_router, prefix="/api/itinerary", tags=["Itinerary"])
app.include_router(chatbot_router, prefix="/api/chatbot", tags=["Chatbot"])


if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
