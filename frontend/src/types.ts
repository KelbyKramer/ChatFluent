export interface ConversationItem {
    role: 'user' | 'assistant' | 'ai';
    content: string;
    translation: string;
    summary?: string;
    response_prompts?: Prompt[];
    isPrompt?: boolean;
}


// Define the prompt structure
export interface Prompt {
    spanish: string;
    english: string;
}

// Define response prompts array type
export interface ResponsePrompts {
    response_prompts: Prompt[];
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
