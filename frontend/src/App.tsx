import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { ConversationItem } from './types';
import { processSpeech } from './api/speechApi';
import ConversationList from './components/ConversationList';

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

  // TODO: separate component for speak functionality
  const speak = (text: string, lang = 'en-US', messageId: number) => {
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

  const handleStopListening = async () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
    const userInput = finalText || transcribedText;
    
    // Add user input to conversation
    setConversation(prev => [...prev, { role: 'user', content: userInput, translation: "" }]);
  
    const result = await processSpeech(userInput);
    
    if (result.success && result.data) {
      setConversation(prev => [...prev, result.data] as ConversationItem[]);
      setHasAISpoken(false);
    } else {
      // Handle error (e.g., show error message to user)
      console.error('Error processing speech:', result.error);
      // You might want to add an error message to the conversation or show a notification
      setConversation(prev => [...prev, { role: 'ai', content: 'Sorry, there was an error processing your request.', translation: 'Sorry, translation is not available' }]);
    }
  
    setFinalText('');
    resetTranscript();
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
      <ConversationList
        conversation={conversation}
        currentWord={currentWord}
        speakingMessageId={speakingMessageId}
        speak={speak}
        language={language}
      />
    </div>
  );
}

export default App;
