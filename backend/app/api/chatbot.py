from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.services.chatbot_service import process_message

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    
class ChatResponse(BaseModel):
    response: str
    conversation_id: str
    suggestions: Optional[List[str]] = None



@router.post("/message", response_model=ChatResponse)
async def chat_message(message: ChatMessage):
    try:
        response = process_message(
            message=message.message,
            conversation_id=message.conversation_id
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


