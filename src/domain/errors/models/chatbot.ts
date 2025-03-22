// FAQ data structure
export interface FAQ {
    question: string;
    answer: string;
    keywords: string[];
  }
  
  // Chat session to maintain context
  export interface ChatSession {
    id: string;
    messages: {
      role: 'user' | 'model' | 'system';
      parts: {
        text: string;
      }[];
    }[];
    createdAt: Date;
    lastActivity: Date;
  }
  
  // Response structure for FAQ matching
  export interface FAQResponse {
    answer: string;
    confidence: number;
    resources?: any[];
  }
  
  // Supported chatbot response sources
  export type ResponseSource = 'simple' | 'faq' | 'gemini';