import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function App() {
  const [message, setMessage] = useState('');
  const [transcribedText, setTranscribedText] = useState('');
  const [finalText, setFinalText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    setTranscribedText(transcript);
  }, [transcript]);

  const handleStartListening = () => {
    setIsListening(true);
    setFinalText('');
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language });
  };

  const handleStopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  const handleSendToBackend = () => {
    fetch('http://localhost:5000/api/process-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: finalText || transcribedText }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response from backend:', data);
        setFinalText(data.message); // Update the finalText with the processed text
      })
      .catch(error => console.error('Error:', error));
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="App">
      <h1>Hello from React!</h1>
      <p>Message from Python: {message}</p>
      <div>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="en-US">English</option>
          <option value="es-ES">Spanish</option>
        </select>
        <button onClick={handleStartListening} disabled={isListening}>
          Start Listening
        </button>
        <button onClick={handleStopListening} disabled={!isListening}>
          Stop Listening
        </button>
        <button onClick={resetTranscript}>Reset</button>
        <button onClick={handleSendToBackend}>Send to Backend</button>
      </div>
      <div style={{margin: '20px 0'}}>
        <h3>Real-time Transcription:</h3>
        <p style={{backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px'}}>
          {transcribedText || 'Start speaking...'}
        </p>
      </div>
      {finalText && (
        <div style={{margin: '20px 0'}}>
          <h3>Final Recorded Text:</h3>
          <p style={{backgroundColor: '#e6f7ff', padding: '10px', borderRadius: '5px'}}>
            {finalText}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
