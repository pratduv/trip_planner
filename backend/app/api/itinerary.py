from typing import List, Optional

from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.itinerary_service import generate_itinerary

load_dotenv()

router = APIRouter()


class ItineraryRequest(BaseModel):
    destination: str
    duration: int
    budget: float
    num_people: int
    preferences: List[str]
    start_date: str


class ItineraryDay(BaseModel):
    day: int
    activities: List[dict]
    accommodation: Optional[dict] = None
    meals: List[dict] = []
    transportation: Optional[dict] = None


class ItineraryResponse(BaseModel):
    destination: str
    duration: int
    total_cost: float
    days: List[ItineraryDay]
    summary: str
    tips: List[str]


@router.post("/generate", response_model=ItineraryResponse)
async def create_itinerary(request: ItineraryRequest):
    try:
        itinerary = generate_itinerary(
            destination=request.destination,
            duration=request.duration,
            budget=request.budget,
            num_people=request.num_people,
            preferences=request.preferences,
            start_date=request.start_date,
        )
        return itinerary
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
