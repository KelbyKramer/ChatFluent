import React from 'react';

interface ConversationStarterProps {
  onStarterClick: (text: string, isPrompt?: boolean) => void;
}

const ConversationStarters: React.FC<ConversationStarterProps> = ({ onStarterClick }) => {
  const starters = [
    {
      spanish: "¿Cómo estás?",
      english: "How are you?"
    },
    {
      spanish: "¿De dónde eres?",
      english: "Where are you from?"
    },
    {
      spanish: "¿Qué te gusta hacer?",
      english: "What do you like to do?"
    }
  ];

  return (
    <div style={{ 
      display: 'flex', 
      gap: '10px', 
      marginBottom: '20px',
      flexWrap: 'wrap'
    }}>
      {starters.map((starter, index) => (
        <button
          key={index}
          onClick={() => onStarterClick(starter.spanish)}
          style={{
            padding: '10px 15px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ddd',
            borderRadius: '5px',
            cursor: 'pointer',
            minWidth: '200px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <span style={{ fontWeight: 'bold' }}>{starter.spanish}</span>
          <span style={{ fontSize: '0.9em', color: '#666' }}>{starter.english}</span>
        </button>
      ))}
    </div>
  );
};

export default ConversationStarters;
