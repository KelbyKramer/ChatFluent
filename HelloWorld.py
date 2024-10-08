import speech_recognition as sr
import openai as openai
from flask import Flask, send_from_directory, jsonify
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__, static_folder='frontend/build')

import speech_recognition as sr
recognizer = sr.Recognizer()

@app.route('/api/hello')
def hello():
    return jsonify(message="Hello from Python!")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

# Function to convert speech to text in Spanish
def speech_to_text_spanish():
    with sr.Microphone() as source:
        print("Please, say something...")  # Prompt in English
        recognizer = sr.Recognizer()
        # Adjust for ambient noise and record audio
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.listen(source)

        try:
            # Convert speech to text in Spanish
            text = recognizer.recognize_google(audio, language='es-ES')
            print(f"You said: {text}")  # Output in English

            # Generate a response using OpenAI API
            response = generate_ai_response(text)
            print(f"AI Response: {response}")

        except sr.UnknownValueError as e:
            print("Sorry, I couldn't understand the audio.")
        except sr.RequestError as e:
            print(f"Could not request results from Google Speech Recognition service; {e}")
def generate_ai_response(user_input):
    try:
        # Call the OpenAI API to generate a response
        completion = openai.chat.completions.create(
            model="gpt-3.5-turbo",  # You can also use "gpt-4" if you have access
            messages=[
                {"role": "user", "content": user_input}
            ],
            temperature=0.7,  # Adjusts the randomness of the output
            max_tokens=150,   # Limits the response length
        )
        return completion.choices[0].message.content
    except Exception as e:
        print(f"Error while contacting OpenAI API: {e}")
        return "Sorry, there was an error generating the response."

if __name__ == "__main__":
    # app.run(use_reloader=True, port=5000, threaded=True)
    speech_to_text_spanish()
