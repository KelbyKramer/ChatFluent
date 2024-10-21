import React from 'react';
import { HighlightedTextProps } from '../types';

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

export default HighlightedText;
