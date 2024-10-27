export interface ConversationItem {
    role: 'user' | 'assistant' | 'ai';
    content: string;
    translation: string; // This could be not included for user input
    summary?: string
  }
  
  export interface HighlightedTextProps {
    text: string;
    currentWord: number;
    isSpeaking: boolean;
  }

  export interface ApiResponse {
    success: boolean;
    data?: ConversationItem;
    error?: string;
  }