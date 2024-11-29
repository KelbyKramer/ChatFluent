import speech_recognition as sr
import openai
import os
import json
openai.api_key = os.getenv("OPENAI_API_KEY")
def process_text(input_text, conversation_history=None):
    DEFAULT_PROMPTS = [
        {
            "spanish": "¿Cómo estás?",
            "english": "How are you?"
        },
        {
            "spanish": "¿De dónde eres?",
            "english": "Where are you from?"
        },
        {
            "spanish": "¿Qué te gusta hacer?",
            "english": "What do you like to do?"
        }
    ]
    try:
        # Initialize system messages with instructions to use personal context
        # TODO: Clean this up
        messages = [
            {
                "role": "system", 
                "content": """Spanish conversation assistant that::
                            1. Responds in Spanish with context from previous interactions
                            2. Provides English translation
                            3. Maintains English summary of key points and user details
                            4. Provides 3 recommended question response prompts for the response in an array and each
                            index has keys spanish: and english: that have the spanish and english translation of the prompt

                            Format your response as a JSON object with these exact keys:
                            {
                                "conversation": "your contextual Spanish response here",
                                "translation": "English translation of your response",
                                "summary": "YOUR CUMULATIVE ENGLISH SUMMARY HERE - Include all previous context and this interaction"
                                "response_prompts": "array of response prompts given the contextual Spanish response"
                            }"""
            }
        ]
        
        # Add previous conversation summary with explicit instructions for using context
        if conversation_history:
            messages.append({
                "role": "system",
                "content": f"""PREVIOUS CONVERSATION CONTEXT: {conversation_history}

                              IMPORTANT INSTRUCTIONS FOR CONTEXTUAL RESPONSE:
                              1. The above summary contains personal context about the user
                              2. Use this information to inform and personalize your response
                              3. Reference relevant previous details naturally in your response
                              4. Connect new information with existing knowledge about the user
                              5. Maintain conversational continuity
                              
                              Example approach:
                              - If user previously mentioned loving Mexican food
                              - And they now ask about restaurants
                              - Include Mexican restaurants in your response
                              - Reference their known preference
                              - Keep the summary in English

                              Remember: Demonstrate your memory of previous interactions while staying natural."""
            })
        
        # Add current context with instruction to blend old and new information
        messages.append({
            "role": "user", 
            "content": f"Using the context from our previous conversation history (if any), respond to this message in Spanish: {input_text}"
        })

        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            temperature=0.7,
            max_tokens=2000,
        )
        response = completion.choices[0].message.content
        try:
            parsed_response = json.loads(response)
            # Ensure the response has all required fields
            if not all(key in parsed_response for key in ['conversation', 'translation', 'summary', 'response_prompts']):
                raise json.JSONDecodeError("Missing required fields", response, 0)

            # Check if response_prompts is empty or None and set default prompts
            if not parsed_response.get('response_prompts') or len(parsed_response['response_prompts']) == 0:
                parsed_response['response_prompts'] = DEFAULT_PROMPTS

            # Compress summary if it gets too long (e.g., > 1000 characters)
            if len(parsed_response['summary']) > 1000:
                parsed_response['summary'] = compress_summary(parsed_response['summary'])

            return parsed_response
        except json.JSONDecodeError:
            json_error_string = "JSON Decode error parsing response" 
            return {
                "conversation": json_error_string, 
                "translation": json_error_string,
                "summary": json_error_string,
                "response_prompts": json_error_string
            }
    except Exception as e:
        print(f"Error while contacting OpenAI API: {e}")
        return {
            "conversation": "Sorry, there was an error generating the response.", 
            "translation": "Sorry, there was an error generating the response.",
            "summary": "Error generating summary",
            "response_prompts": "Error generating response prompts"
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