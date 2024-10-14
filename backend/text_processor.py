import speech_recognition as sr
import openai
import os
import json

# Ensure you've set your OpenAI API key
openai.api_key = os.getenv("OPENAI_API_KEY")
def process_text(input_text):
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant. Respond to the user's input in Spanish, then provide an English translation of your response. Format your response as a JSON object with 'conversation' and 'translation' keys."},
                {"role": "user", "content": input_text}
            ],
            temperature=0.7,
            max_tokens=300,
        )
        response = completion.choices[0].message.content
        # Parse the JSON response
        try:
            parsed_response = json.loads(response)
            return parsed_response
        except json.JSONDecodeError:
            # Fallback in case the model doesn't return valid JSON
            return {"conversation": "Error parsing response", "translated": "Error parsing response"}
    except Exception as e:
        print(f"Error while contacting OpenAI API: {e}")
        return {"conversation": "Sorry, there was an error generating the response.", 
                "translated": "Sorry, there was an error generating the response."}
