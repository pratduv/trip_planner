import os

from galileo import log

# Initialize OpenAI client
from galileo.openai import openai

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


@log
def get_completion(messages, model="gpt-4o", temperature=0.7, max_tokens=2000):
    """
    Get a completion from OpenAI's API.

    Args:
        messages: List of message dictionaries with 'role' and 'content'
        model: The model to use
        temperature: Controls randomness (0-1)
        max_tokens: Maximum number of tokens to generate

    Returns:
        The generated text response
    """
    try:
        response = client.chat.completions.create(
            model=model, messages=messages, temperature=temperature, max_tokens=max_tokens
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        raise e


@log
def get_structured_completion(messages, model="gpt-4o", temperature=0.7, max_tokens=2000):
    """
    Get a structured JSON completion from OpenAI's API.

    Args:
        messages: List of message dictionaries with 'role' and 'content'
        model: The model to use
        temperature: Controls randomness (0-1)
        max_tokens: Maximum number of tokens to generate

    Returns:
        The generated response as a Python dictionary
    """
    # with galileo_context():
    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=temperature,
            max_tokens=max_tokens,
            response_format={"type": "json_object"},
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")
        raise e
