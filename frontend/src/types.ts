export interface ConversationItem {
    role: 'user' | 'assistant' | 'ai';
    content: string;
  }
  
  export interface HighlightedTextProps {
    text: string;
    currentWord: number;
    isSpeaking: boolean;
  }