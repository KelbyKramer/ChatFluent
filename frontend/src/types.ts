export interface ConversationItem {
    role: 'user' | 'assistant' | 'ai';
    content: string;
    translation: string;
    summary?: string;
    response_prompts?: Array<{
        spanish: string;
        english: string;
    }>;
    isPrompt?: boolean;
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
