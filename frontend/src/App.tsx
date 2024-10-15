import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { ConversationItem, HighlightedTextProps } from './types';
import ListeningComponent from './components/ListeningComponent';


function App() {
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [finalText, setFinalText] = useState<string>('');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>('en-US');
  const [conversation, setConversation] = useState<ConversationItem[]>([]);
  const [speakingMessageId, setSpeakingMessageId] = useState<number | null>(null);
  const [currentWord, setCurrentWord] = useState<number>(-1);
  const [lastSpokenIndex, setLastSpokenIndex] = useState<number>(-1);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hasAISpoken, setHasAISpoken] = useState<boolean>(false);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    setTranscribedText(transcript);
  }, [transcript]);

  useEffect(() => {
    const lastMessage: ConversationItem = conversation[conversation.length - 1];
    if (lastMessage && lastMessage.role === 'ai' && !hasAISpoken) {
      speak(lastMessage.content, language, conversation.length - 1);
      setHasAISpoken(true);
    }
  }, [conversation, language, hasAISpoken, lastSpokenIndex]);

  const speak = (text: string, lang = 'en-US', messageId: number) => { // TODO change messageId type
    setIsSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
  
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

  const HighlightedText: React.FC<HighlightedTextProps> = ({ text, currentWord, isSpeaking }) => {
    const words = text.split(' ');
    return (
      <span>
        {words.map((word: string, index: number) => (
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

  //TODO: refactor listening/speaking/other functions to other files to make main page cleaner
  const toggleListening = () => {
    if (isListening) {
      handleStopListening();
    } else {
      handleStartListening();
    }
  };

  const handleStartListening = () => {
    setIsListening(true);
    setFinalText('');
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language });
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
        <button 
          onClick={toggleListening} 
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: isListening ? '#ff4136' : '#0074D9',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            margin: '10px'
          }}
        >
          {isListening ? <FaStop /> : <FaMicrophone />}
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
