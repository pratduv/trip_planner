import os
from galileo.openai import openai
from dotenv import load_dotenv
load_dotenv()
# Initialize the Galileo wrapped OpenAI client
client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

from galileo import log


def call_openai():
    chat_completion = client.chat.completions.create(
        messages=[{"role": "user", "content": "I like pizza food"}],
        model="gpt-4o"
    )
    return chat_completion.choices[0].message.content

# This will create a single span trace with the OpenAI call
response = call_openai()
print(response)