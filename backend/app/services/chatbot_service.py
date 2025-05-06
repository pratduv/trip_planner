import json
import logging
import uuid
from typing import Any, Dict, Optional

from galileo import log

from app.utils.openai_client import get_completion, get_structured_completion

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# import patronus
# from patronus import traced

# # Initialize the SDK with your API key
# patronus.init(
#     # This is the default and can be omitted
#     api_key=os.environ.get("PATRONUS_API_KEY")
# )

# In-memory storage for conversations
# In production, this would be a database
conversations = {}


@log
def process_message(message: str, conversation_id: Optional[str] = None) -> Dict[str, Any]:
    """
    Process a user message and generate a response using OpenAI's API.

    This function:
    1. Uses an LLM for natural language understanding
    2. Maintains conversation context
    3. Generates relevant suggestions based on the conversation
    """
    # Create a new conversation if needed
    logger.info(f"Processing message: '{message[:50]}...' with conversation_id: {conversation_id}")
    if not conversation_id or conversation_id not in conversations:
        conversation_id = str(uuid.uuid4())
        logger.info(f"Creating new conversation with ID: {conversation_id}")
        conversations[conversation_id] = {
            "messages": [],
            "preferences": [],
            "timeline": "",
            "budget": "",
            "travelers": 0,
        }

    # Add message to conversation history
    conversations[conversation_id]["messages"].append({"role": "user", "content": message})

    # Prepare conversation for OpenAI
    openai_messages = [
        {
            "role": "system",
            "content": "You are a helpful travel assistant. Your job is to help users plan their trips by understanding their preferences, suggesting destinations, and providing travel advice. Keep your responses concise and focused on travel planning. At the end of your response, suggest 3-4 relevant follow-up options the user might be interested in.",
        }
    ]

    # Add conversation history
    for msg in conversations[conversation_id]["messages"]:
        openai_messages.append({"role": msg["role"], "content": msg["content"]})

    # Get response from OpenAI
    try:
        logger.info(f"Sending request to OpenAI with {len(openai_messages)} messages")
        # Get the main response
        ai_response = get_completion(openai_messages)
        logger.info(f"Received response from OpenAI: '{ai_response[:50]}...")

        # Generate suggestions
        suggestion_prompt = [
            {
                "role": "system",
                "content": "Based on the conversation between a travel assistant and a user, generate 3-4 short phrases (2-4 words each) that would be good clickable suggestion buttons for the user to continue the conversation. Format as a JSON array of strings. Only include the JSON array, nothing else.",
            }
        ]

        for msg in conversations[conversation_id]["messages"]:
            suggestion_prompt.append({"role": msg["role"], "content": msg["content"]})

        suggestion_prompt.append({"role": "assistant", "content": ai_response})

        logger.info("Generating suggestions from OpenAI")
        suggestions_json = get_structured_completion(suggestion_prompt)
        logger.info(f"Received suggestions JSON: {suggestions_json}")
        # Ensure suggestions is a list of strings
        try:
            suggestions_data = json.loads(suggestions_json)
            # Handle different possible formats from OpenAI
            if isinstance(suggestions_data, list):
                suggestions = suggestions_data
            elif isinstance(suggestions_data, dict) and "suggestion_buttons" in suggestions_data:
                suggestions = suggestions_data["suggestion_buttons"]
            else:
                suggestions = ["Tell me more", "Explore destinations", "Travel tips"]
        except:
            suggestions = ["Tell me more", "Explore destinations", "Travel tips"]

        # Update conversation with assistant's response
        conversations[conversation_id]["messages"].append({"role": "assistant", "content": ai_response})

        # Extract preferences from the conversation (this would be more sophisticated in production)
        if "preferences" not in conversations[conversation_id] or not conversations[conversation_id]["preferences"]:
            conversations[conversation_id]["preferences"] = []

        # Use OpenAI to extract preferences
        if len(conversations[conversation_id]["messages"]) >= 4:  # After a few exchanges
            preference_prompt = [
                {
                    "role": "system",
                    "content": 'Extract travel preferences from this conversation. Return ONLY a JSON array of strings representing travel preferences (e.g., ["beaches", "cultural sites", "food"]).',
                }
            ]

            for msg in conversations[conversation_id]["messages"]:
                preference_prompt.append({"role": msg["role"], "content": msg["content"]})

            try:
                preferences_json = get_structured_completion(preference_prompt)
                extracted_preferences = json.loads(preferences_json)
                if isinstance(extracted_preferences, list) and extracted_preferences:
                    conversations[conversation_id]["preferences"] = extracted_preferences
            except:
                # If preference extraction fails, continue without updating preferences
                pass

        response = ai_response
    except Exception as e:
        logger.error(f"Error getting AI response: {e}", exc_info=True)
        response = "I'm having trouble connecting to my knowledge base right now. Could you please try again?"
        suggestions = ["Try again", "Ask something else", "Start over"]

    # Add response to conversation history
    conversations[conversation_id]["messages"].append({"role": "assistant", "content": response})

    return {"response": response, "conversation_id": conversation_id, "suggestions": suggestions}
