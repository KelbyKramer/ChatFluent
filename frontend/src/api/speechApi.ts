import { ConversationItem, ApiResponse } from '../types';

export const processSpeech = async (userInput: string): Promise<ApiResponse> => {
    try {
      const response = await fetch('http://localhost:5000/api/process-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: userInput }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      return { 
        success: true, 
        data: { 
          role: 'ai', 
          content: data.message.conversation, 
          translation: data.message.translation,
          summary: data.message.summary
         }
      };
    } catch (error) {
      console.error('Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      };
    }
  };