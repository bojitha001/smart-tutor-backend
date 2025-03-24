export interface FAQ {
    question: string;
    answer: string;
    keywords: string[];
  }
  
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
  

  export interface FAQResponse {
    answer: string;
    confidence: number;
    resources?: any[];
  }
  
  
  export type ResponseSource = 'simple' | 'faq' | 'gemini';