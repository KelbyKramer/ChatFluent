import speech_recognition as sr
import openai

def process_text(input_text):
    try:
        # Call the OpenAI API to generate a response
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # You can also use "gpt-4" if you have access
            messages=[
                {"role": "user", "content": input_text}
            ],
            temperature=0.7,  # Adjusts the randomness of the output
            max_tokens=150,   # Limits the response length
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error while contacting OpenAI API: {e}")
        return "Sorry, there was an error generating the response."