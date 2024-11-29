import React, { useState } from 'react';
import HighlightedText from './HighlightedText';
import { ConversationItem } from '../types';

interface ConversationListProps {
  conversation: ConversationItem[];
  currentWord: number;
  speakingMessageId: number | null;
  speak: (text: string, language: string, index: number) => void;
  language: string;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversation,
  currentWord,
  speakingMessageId,
  speak,
  language
}) => {
  // Track translation states for each message
  const [translations, setTranslations] = useState<{ [key: number]: string }>({});
  const [showTranslations, setShowTranslations] = useState<{ [key: number]: boolean }>({});

  const toggleTranslation = async (text: string, index: number) => {
    if (showTranslations[index]) {
      // Hide translation
      setShowTranslations(prev => ({ ...prev, [index]: false }));
    } else {
      // Show translation
      if (!translations[index]) {
        // Fetch translation if it doesn't exist
        try {
          setTranslations(prev => ({ ...prev, [index]: conversation[index].translation }));
        } catch (error) {
          console.error('Translation failed:', error);
          return;
        }
      }
      setShowTranslations(prev => ({ ...prev, [index]: true }));
    }
  };
  return (
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
          {showTranslations[index] && translations[index] && (
            <div style={{
              marginTop: '10px',
              padding: '10px',
              backgroundColor: 'rgba(0,0,0,0.05)',
              borderRadius: '3px'
            }}>
              <strong>Translation:</strong> {translations[index]}
            </div>
          )}
          <div style={{ marginTop: '10px' }}>
            <button 
              onClick={() => speak(message.content, language, index)}
              style={{
                marginRight: '10px',
                padding: '5px 10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Speak
            </button>
            <button 
              onClick={() => toggleTranslation(message.content, index)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#008CBA',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              {showTranslations[index] ? 'Hide Translation' : 'Translate'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
