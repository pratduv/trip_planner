import json
from datetime import datetime, timedelta
from typing import Any, Dict, List

from galileo import log

from app.utils.openai_client import get_structured_completion


@log
def generate_itinerary(
    destination: str, duration: int, budget: float, num_people: int, preferences: List[str], start_date: str
) -> Dict[str, Any]:
    """
    Generate a travel itinerary based on user parameters using OpenAI's API.

    This function uses an LLM to create a personalized travel itinerary
    based on the destination, duration, budget, number of people, and preferences.
    """
    # Parse start date for formatting in the prompt
    try:
        start_date_obj = datetime.strptime(start_date, "%Y-%m-%d")
        formatted_start_date = start_date_obj.strftime("%B %d, %Y")  # e.g., "May 15, 2025"
    except ValueError:
        start_date_obj = datetime.now() + timedelta(days=30)
        formatted_start_date = start_date_obj.strftime("%B %d, %Y")

    # Calculate budget per day per person for the prompt
    daily_budget = budget / (duration * num_people)

    # Create a prompt for OpenAI
    prompt = [
        {
            "role": "system",
            "content": f"""You are a travel planning expert AI. Create a detailed itinerary for a trip based on the following parameters:
        - Destination: {destination}
        - Duration: {duration} days
        - Start Date: {formatted_start_date}
        - Total Budget: ${budget}
        - Number of People: {num_people}
        - Daily Budget per Person: ${daily_budget:.2f}
        - Preferences: {", ".join(preferences)}
        
        Return the response as a JSON object with the following structure:
        {{
          "destination": "{destination}",
          "duration": {duration},
          "total_cost": 0,
          "days": [
            {{
              "day": 1,
              "date": "YYYY-MM-DD",
              "activities": [
                {{
                  "name": "Activity Name",
                  "type": "activity type (e.g., nature, culture)",
                  "cost": 0.00,
                  "time": "HH:MM",
                  "duration": "X hours",
                  "description": "Brief description"
                }}
              ],
              "accommodation": {{
                "name": "Accommodation Name",
                "cost": 0.00,
                "rating": 0.0,
                "address": "Address"
              }},
              "meals": [
                {{
                  "type": "Breakfast/Lunch/Dinner",
                  "name": "Restaurant or meal type",
                  "cost": 0.00
                }}
              ],
              "transportation": {{
                "type": "Transportation type",
                "cost": 0.00
              }}
            }}
          ],
          "summary": "A brief summary of the trip",
          "tips": ["Tip 1", "Tip 2", "Tip 3", "Tip 4"]
        }}
        
        For each day, include:
        1. 2-4 activities relevant to the preferences
        2. Accommodation details
        3. Three meals (breakfast, lunch, dinner)
        4. Transportation options
        
        Make sure all costs are realistic for the destination and add up to be within the total budget.
        Include specific local attractions, restaurants, and experiences that match the preferences.
        Calculate the total_cost as the sum of all activities, accommodations, meals, and transportation costs.
        Include 4-5 useful tips specific to this destination and itinerary.
        """,
        }
    ]

    try:
        # Get structured response from OpenAI
        response_json = get_structured_completion(prompt)
        itinerary = json.loads(response_json)

        # Ensure the response has the expected structure
        if not isinstance(itinerary, dict) or "days" not in itinerary or "total_cost" not in itinerary:
            raise ValueError("Invalid response structure from AI")

        return itinerary

    except Exception as e:
        print(f"Error generating itinerary: {e}")
        # Create a fallback itinerary if the API call fails
        days = []

        # Generate a simple fallback itinerary
        for day_num in range(1, duration + 1):
            current_date = start_date_obj + timedelta(days=day_num - 1)

            # Create a basic day structure
            day = {
                "day": day_num,
                "date": current_date.strftime("%Y-%m-%d"),
                "activities": [
                    {
                        "name": f"Explore {destination}",
                        "type": "sightseeing",
                        "cost": 20.00,
                        "time": "10:00",
                        "duration": "3 hours",
                        "description": f"Explore the highlights of {destination}.",
                    },
                    {
                        "name": "Local Museum",
                        "type": "culture",
                        "cost": 15.00,
                        "time": "14:00",
                        "duration": "2 hours",
                        "description": "Visit a local museum to learn about the history and culture.",
                    },
                ],
                "accommodation": {
                    "name": f"{destination} Hotel",
                    "cost": 100.00,
                    "rating": 4.0,
                    "address": f"123 Main St, {destination}",
                },
                "meals": [
                    {"type": "Breakfast", "name": "Hotel Breakfast", "cost": 10.00},
                    {"type": "Lunch", "name": "Local Cafe", "cost": 15.00},
                    {"type": "Dinner", "name": "Restaurant", "cost": 25.00},
                ],
                "transportation": {"type": "Public Transit", "cost": 10.00},
            }

            days.append(day)

        # Calculate total cost
        total_cost = sum(
            sum(activity["cost"] for activity in day["activities"])
            + day["accommodation"]["cost"]
            + sum(meal["cost"] for meal in day["meals"])
            + day["transportation"]["cost"]
            for day in days
        )

        # Create fallback itinerary
        return {
            "destination": destination,
            "duration": duration,
            "total_cost": round(total_cost, 2),
            "days": days,
            "summary": f"A {duration}-day trip to {destination} for {num_people} people with a focus on {', '.join(preferences)}.",
            "tips": [
                f"Research the best time to visit {destination} based on weather and crowds.",
                "Consider purchasing travel insurance for your trip.",
                "Learn a few basic phrases in the local language.",
                "Make copies of important documents like passports and travel insurance.",
            ],
        }
