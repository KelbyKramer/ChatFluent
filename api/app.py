import sys
import os

# Add the parent directory to sys.path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from flask import Flask, jsonify, request
from flask_cors import CORS
from backend.text_processor import process_text

app = Flask(__name__)
CORS(app)

@app.route('/api/hello')
def hello():
    print("Received request for /api/hello")  # This will print in your server console
    return jsonify(message="Hello from Python Backend!")

@app.route('/api/process-speech', methods=['POST'])
def process_speech():
    print("in process speech function")
    print(request)
    data = request.json
    text = data.get('text', '')
    
    # Process the text here
    processed_text = process_text(text)
    
    return jsonify({'processed_text': processed_text})

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True)
