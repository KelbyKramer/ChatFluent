import React from 'react';

interface ConversationStarterProps {
  onStarterClick: (text: string, isPrompt?: boolean) => void;
  prompts?: Array<{ spanish: string; english: string }>;
}

const ConversationStarters: React.FC<ConversationStarterProps> = ({ 
  onStarterClick, 
  prompts
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '10px', 
      marginBottom: '20px',
      flexWrap: 'wrap'
    }}>
      {prompts?.map((prompt, index) => (
        <button
          key={index}
          onClick={() => onStarterClick(prompt.spanish)}
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
          <span style={{ fontWeight: 'bold' }}>{prompt.spanish}</span>
          <span style={{ fontSize: '0.9em', color: '#666' }}>{prompt.english}</span>
        </button>
      ))}
    </div>
  );
};

export default ConversationStarters;
