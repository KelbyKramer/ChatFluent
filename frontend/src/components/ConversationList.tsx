import React from 'react';
import HighlightedText from './HighlightedText';

interface Message {
  role: string;
  content: string;
}

interface ConversationListProps {
  conversation: Message[];
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

    const displayTranslate = async (text: string, index: number) => {
        // Implement Display Translate here
      };
      console.log("convo here", conversation)
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
              onClick={() => displayTranslate(message.content, index)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#008CBA',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              Translate
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ConversationList;
