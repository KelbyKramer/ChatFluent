import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function App() {
  const [transcribedText, setTranscribedText] = useState('');
  const [finalText, setFinalText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [conversation, setConversation] = useState([]);

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

  const speak = (text, lang = 'en-US') => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const handleStopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
    const userInput = finalText || transcribedText;
    
    // Add user input to conversation
    setConversation(prev => [...prev, { role: 'user', content: userInput }]);
  
    fetch('http://localhost:5000/api/process-speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: userInput }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Response from backend:', data);
        // Add AI response to conversation
        // TODO: Abstract this to current and native language, implement translate UI functionality
        setConversation(prev => [...prev, { role: 'ai', content: data.message.spanish }]);
        speak(data.message.spanish, language)
        setFinalText('');
        resetTranscript();
      })
      .catch(error => console.error('Error:', error));
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  return (
    <div className="App">
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
      </div>
      <div style={{margin: '20px 0'}}>
        <h3>Real-time Transcription:</h3>
        <p style={{backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px'}}>
          {transcribedText || 'Start speaking...'}
        </p>
      </div>
      <div style={{margin: '20px 0', maxHeight: '400px', overflowY: 'auto'}}>
        <h3>Conversation:</h3>
        {conversation.map((message, index) => (
          <div key={index} style={{
            backgroundColor: message.role === 'user' ? '#e6f7ff' : '#f0f0f0',
            padding: '10px',
            borderRadius: '5px',
            margin: '10px 0'
          }}>
            <strong>{message.role === 'user' ? 'You:' : 'AI:'}</strong> {message.content}
            {<button onClick={() => speak(message.content, language)} style={{marginLeft: '10px'}}>
              Speak
            </button>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
