export interface ConversationItem {
    role: 'user' | 'assistant' | 'ai';
    content: string;
    translation: string | null;
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