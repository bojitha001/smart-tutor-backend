import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { FAQ, ChatSession, FAQResponse } from '../../domain/errors/models/chatbot';


dotenv.config();


const chatSessions: Record<string, ChatSession> = {};


let faqs: FAQ[] = [];
const faqPath = path.join(__dirname, '../../data/faqs.json');

try {
  if (fs.existsSync(faqPath)) {
    const faqData = fs.readFileSync(faqPath, 'utf8');
    faqs = JSON.parse(faqData);
    console.log(`Loaded ${faqs.length} FAQs from file`);
  } else {
   
    faqs = [
      {
        question: 'Hello',
        answer: 'Hi there! Welcome to Smart Tutor. How can I help you today?',
        keywords: ['hi', 'hello', 'hey']
      },
      
    ];
    
    
    try {
      if (!fs.existsSync(path.dirname(faqPath))) {
        fs.mkdirSync(path.dirname(faqPath), { recursive: true });
      }
      fs.writeFileSync(faqPath, JSON.stringify(faqs, null, 2));
      console.log(`Created default FAQs file at ${faqPath}`);
    } catch (err) {
      console.error('Error writing default FAQs file:', err);
    }
  }
} catch (err) {
  console.error('Error loading FAQs:', err);
  
  faqs = [
    {
      question: 'Hello',
      answer: 'Hi there! How can I help you today?',
      keywords: ['hi', 'hello', 'hey']
    }
  ];
}

export function getResponseFromFAQ(userQuestion: string): FAQResponse {
 
  if (!userQuestion || userQuestion.trim() === '') {
    return {
      answer: "I didn't catch that. How can I help you with our tutoring platform?",
      confidence: 1.0
    };
  }
  
  const normalizedQuestion = userQuestion.toLowerCase().trim();
  

  if (normalizedQuestion.length < 5) {
    
    for (const faq of faqs.slice(0, 2)) { 
      if (faq.keywords.includes(normalizedQuestion)) {
        return {
          answer: faq.answer,
          confidence: 1.0
        };
      }
    }
  }
  
  
  for (const faq of faqs) {
    if (normalizedQuestion === faq.question.toLowerCase()) {
      return {
        answer: faq.answer,
        confidence: 1.0
      };
    }
  }
  
  
  let bestMatch: FAQ | null = null;
  let highestConfidence = 0;
  
  
  faqs.forEach(faq => {
    const questionWords = normalizedQuestion.split(' ');
    const faqWords = faq.question.toLowerCase().split(' ');
    
    let commonWords = 0;
    let keywordMatches = 0;
    
    questionWords.forEach(word => {
      if (faqWords.includes(word)) {
        commonWords++;
      }
      if (faq.keywords.includes(word.toLowerCase())) {
        keywordMatches++;
      }
    });
    
    
    const wordConfidence = commonWords / Math.max(questionWords.length, faqWords.length);
    const keywordConfidence = keywordMatches > 0 ? keywordMatches / faq.keywords.length : 0;
    
    
    const confidence = (wordConfidence * 0.4) + (keywordConfidence * 0.6);
    
    if (confidence > highestConfidence) {
      highestConfidence = confidence;
      bestMatch = faq;
    }
  });
  
  if (bestMatch && highestConfidence > 0.6) {
    return {
      answer: (bestMatch as FAQ).answer,
      confidence: highestConfidence
    };
  }
  
  
  return {
    answer: "I'm not sure I understand. Could you try rephrasing your question?",
    confidence: 0
  };
}


export async function getGeminiResponse(sessionId: string, message: string): Promise<string> {
  try {
   
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.warn('Google Gemini API key is not set. Falling back to generic response.');
      return "I don't have a specific answer for that question. Please ask something about our tutoring services.";
    }
    if (!chatSessions[sessionId]) {
      chatSessions[sessionId] = {
        id: sessionId,
        messages: [
          {
            role: 'system',
            parts: [{
              text: `You are an AI assistant for a Smart Tutor platform. Your name is Tutor AI.
              
              When answering questions:
              1. Be helpful, educational, and informative
              2. Provide thorough, well-structured responses
              3. Use markdown formatting for clarity when appropriate (bullet points, numbered lists, etc.)
              4. If asked about topics outside education, gently steer the conversation back to tutoring and learning
              5. Answer questions concisely for simple inquiries, but provide detailed responses for complex topics
              6. When discussing academic subjects, show your expertise by explaining concepts clearly
              7. Always maintain a friendly, supportive tone appropriate for a learning environment
              8. If you don't know an answer, be honest and suggest how they might find that information`
            }]
          }
        ],
        createdAt: new Date(),
        lastActivity: new Date()
      };
    }

    const session = chatSessions[sessionId];
    session.messages.push({
      role: 'user',
      parts: [{ text: message }]
    });
    session.lastActivity = new Date();

    if (session.messages.length > 20) {
      const systemMessage = session.messages.find(msg => msg.role === 'system');
      const recentMessages = session.messages.slice(-19).filter(msg => msg.role !== 'system');
      session.messages = systemMessage ? [systemMessage, ...recentMessages] : recentMessages;
    }

    const contentMessages = session.messages.filter(msg => msg.role !== 'system');

   
    const systemMessage = session.messages.find(msg => msg.role === 'system')?.parts[0].text || '';

    
    const apiEndpoint = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent';
    
    const response = await fetch(`${apiEndpoint}?key=${process.env.GOOGLE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: systemMessage }]
          },
          ...contentMessages
        ],
        safetySettings: [
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 1000
        }
      })
    });

    const data = await response.json() as any;
    
    
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return "I'm having trouble processing your question right now. Please try asking something else.";
    }
    
    
    const geminiMessage = data.candidates[0].content.parts[0].text;
    
    session.messages.push({
      role: 'model',
      parts: [{ text: geminiMessage }]
    });
    
    return geminiMessage;
  } catch (error) {
    console.error('Error with Gemini API:', error);
    return 'I apologize, but I encountered an error. Please try asking something else.';
  }
}

export function getSimpleResponse(message: string): string | null {
  const normalizedMessage = message.toLowerCase().trim();
  
  if (['hi', 'hello', 'hey', 'howdy'].includes(normalizedMessage)) {
    return "Hello! I'm your Smart Tutor AI assistant. How can I help you with your learning journey today?";
  }
  
  if (['how are you', 'how are you doing', 'how\'s it going'].includes(normalizedMessage)) {
    return "I'm doing well! I'm here to help you with any questions about finding tutors, scheduling sessions, or learning resources. What can I assist you with today?";
  }
  
  if (normalizedMessage === 'thanks' || normalizedMessage === 'thank you') {
    return "You're welcome! I'm happy to help. Feel free to ask if you have any other questions about our tutoring platform or academic subjects.";
  }
  
  if (normalizedMessage === 'bye' || normalizedMessage === 'goodbye') {
    return "Goodbye! Feel free to come back anytime you need help with your studies or have questions about our tutoring services. Happy learning!";
  }
  
  return null;
}

export function getSuggestedQuestions(): string[] {
  return faqs.slice(2, 8).map(faq => faq.question);
}