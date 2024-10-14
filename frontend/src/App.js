import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

function App() {
  const [transcribedText, setTranscribedText] = useState('');
  const [finalText, setFinalText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [conversation, setConversation] = useState([]);
  const [speakingMessageId, setSpeakingMessageId] = useState(null);
  const [currentWord, setCurrentWord] = useState(-1);
  const [lastSpokenIndex, setLastSpokenIndex] = useState(-1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasAISpoken, setHasAISpoken] = useState(false);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    setTranscribedText(transcript);
  }, [transcript]);

  useEffect(() => {
    const lastMessage = conversation[conversation.length - 1];
    if (lastMessage && lastMessage.role === 'ai' && !hasAISpoken) {
      console.log("Speaking AI generated message");
      speak(lastMessage.content, language, conversation.length - 1);
      setHasAISpoken(true);
    }
  }, [conversation, language, hasAISpoken, lastSpokenIndex]);

  const handleStartListening = () => {
    setIsListening(true);
    setFinalText('');
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language });
  };

  const speak = (text, lang = 'en-US', messageId) => {
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    
    const words = text.split(' ');
    let wordIndex = 0;
  
    setSpeakingMessageId(messageId);
  
    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        setCurrentWord(wordIndex);
        wordIndex++;
      }
    };
  
    utterance.onend = () => {
      setSpeakingMessageId(null);
      setCurrentWord(-1);
      setIsSpeaking(false);
      setLastSpokenIndex(-1);
    };
  
    window.speechSynthesis.speak(utterance);
  };

  const HighlightedText = ({ text, currentWord, isSpeaking }) => {
    const words = text.split(' ');
    return (
      <span>
        {words.map((word, index) => (
          <span
            key={index}
            style={{
              backgroundColor: isSpeaking && index === currentWord ? 'yellow' : 'transparent',
              padding: '0 2px',
            }}
          >
            {word}{' '}
          </span>
        ))}
      </span>
    );
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
        setConversation(prev => [...prev, { role: 'ai', content: data.message.conversation }]);
        setHasAISpoken(false);
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
            <strong>{message.role === 'user' ? 'You:' : 'AI:'}</strong>{' '}
            <HighlightedText
              text={message.content}
              currentWord={currentWord}
              isSpeaking={speakingMessageId === index}
            />
            <button onClick={() => speak(message.content, language, index)} style={{marginLeft: '10px'}}>
              Speak
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
