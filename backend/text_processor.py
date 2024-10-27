import speech_recognition as sr
import openai
import os
import json

openai.api_key = os.getenv("OPENAI_API_KEY")
def process_text(input_text, conversation_history=None):
    try:
        # Initialize system messages
        messages = [
            {
                "role": "system", 
                "content": """You are a helpful assistant engaging in Spanish conversation. For each user message:
                            1. Generate a natural Spanish response to the user's input
                            2. Provide an English translation of your Spanish response
                            3. Maintain an updated summary of the entire conversation
                            Format your response as a JSON object with these exact keys:
                            {
                                "conversation": "your Spanish response here",
                                "translation": "English translation of your response",
                                "summary": "updated conversation summary"
                            }"""
            }
        ]
        
        # Add previous conversation summary as context if it exists
        if conversation_history:
            messages.append({
                "role": "system",
                "content": f"Previous conversation summary: {conversation_history}"
            })
        
        # Add user's message with explicit instruction
        messages.append({
            "role": "user", 
            "content": f"Respond to this message in Spanish: {input_text}"
        })
        
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
            max_tokens=500,
        )
        response = completion.choices[0].message.content
        print("response here", response)
        
        try:
            parsed_response = json.loads(response)
            # Ensure the response has all required fields
            if not all(key in parsed_response for key in ['conversation', 'translation', 'summary']):
                raise json.JSONDecodeError("Missing required fields", response, 0)

            # Compress summary if it gets too long (e.g., > 1000 characters)
            if len(parsed_response['summary']) > 1000:
                parsed_response['summary'] = compress_summary(parsed_response['summary'])
                
            return parsed_response
        except json.JSONDecodeError:
            return {
                "conversation": "Error parsing response", 
                "translation": "Error parsing response",
                "summary": "Error generating summary"
            }
    except Exception as e:
        print(f"Error while contacting OpenAI API: {e}")
        return {
            "conversation": "Sorry, there was an error generating the response.", 
            "translation": "Sorry, there was an error generating the response.",
            "summary": "Error generating summary"
        }


def compress_summary(summary):
    """Compress a long summary into a more concise version while maintaining key points"""
    try:
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "Compress the following conversation summary into a shorter version while maintaining all key points and context:"
                },
                {"role": "user", "content": summary}
            ],
            temperature=0.7,
            max_tokens=250,
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error compressing summary: {e}")
        return summary