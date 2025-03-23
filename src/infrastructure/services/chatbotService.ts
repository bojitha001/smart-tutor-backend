import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { FAQ, ChatSession, FAQResponse } from '../../domain/errors/models/chatbot';

// Initialize environment variables
dotenv.config();

// In-memory storage for chat sessions
const chatSessions: Record<string, ChatSession> = {};

// Load FAQs from external file if it exists, otherwise use default
let faqs: FAQ[] = [];
const faqPath = path.join(__dirname, '../../data/faqs.json');

try {
  if (fs.existsSync(faqPath)) {
    const faqData = fs.readFileSync(faqPath, 'utf8');
    faqs = JSON.parse(faqData);
    console.log(`Loaded ${faqs.length} FAQs from file`);
  } else {
    // Default FAQs if file doesn't exist
    faqs = [
      // Add your default FAQs here
      {
        question: 'Hello',
        answer: 'Hi there! Welcome to Smart Tutor. How can I help you today?',
        keywords: ['hi', 'hello', 'hey']
      },
      // More FAQs...
    ];
    
    // Save default FAQs for future use
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
  // Set default FAQs if there's an error
  faqs = [
    {
      question: 'Hello',
      answer: 'Hi there! How can I help you today?',
      keywords: ['hi', 'hello', 'hey']
    }
  ];
}

// Function to get response from FAQ with better handling for short messages
export function getResponseFromFAQ(userQuestion: string): FAQResponse {
  // Handle empty messages
  if (!userQuestion || userQuestion.trim() === '') {
    return {
      answer: "I didn't catch that. How can I help you with our tutoring platform?",
      confidence: 1.0
    };
  }
  
  const normalizedQuestion = userQuestion.toLowerCase().trim();
  
  // Special handling for very short messages (likely greetings)
  if (normalizedQuestion.length < 5) {
    // Check greeting keywords
    for (const faq of faqs.slice(0, 2)) { // Check only the greeting FAQs
      if (faq.keywords.includes(normalizedQuestion)) {
        return {
          answer: faq.answer,
          confidence: 1.0
        };
      }
    }
  }
  
  // Check for exact match first
  for (const faq of faqs) {
    if (normalizedQuestion === faq.question.toLowerCase()) {
      return {
        answer: faq.answer,
        confidence: 1.0
      };
    }
  }
  
  // Check for keyword matches
  let bestMatch: FAQ | null = null;
  let highestConfidence = 0;
  
  // Regular fuzzy matching for queries
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
    
    // Weight both word overlap and keyword matches
    const wordConfidence = commonWords / Math.max(questionWords.length, faqWords.length);
    const keywordConfidence = keywordMatches > 0 ? keywordMatches / faq.keywords.length : 0;
    
    // Final confidence is weighted average (keywords matter more)
    const confidence = (wordConfidence * 0.4) + (keywordConfidence * 0.6);
    
    if (confidence > highestConfidence) {
      highestConfidence = confidence;
      bestMatch = faq;
    }
  });
  
  // if (bestMatch && highestConfidence > 0.6) {
  //   return {
  //     answer: bestMatch.answer,
  //     confidence: highestConfidence
  //   };
  // }
  
  // If no good match, provide a low confidence
  return {
    answer: "I'm not sure I understand. Could you try rephrasing your question?",
    confidence: 0
  };
}

// Function to get Google Gemini API response
export async function getGeminiResponse(sessionId: string, message: string): Promise<string> {
  try {
    // Check if API key exists
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      console.warn('Google Gemini API key is not set. Falling back to generic response.');
      return "I don't have a specific answer for that question. Please ask something about our tutoring services.";
    }

    // Get or create a session
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

    // Update session with the new message
    const session = chatSessions[sessionId];
    session.messages.push({
      role: 'user',
      parts: [{ text: message }]
    });
    session.lastActivity = new Date();

    // Keep only the most recent messages if the conversation gets too long
    if (session.messages.length > 20) {
      // Keep the system message and the most recent messages
      const systemMessage = session.messages.find(msg => msg.role === 'system');
      const recentMessages = session.messages.slice(-19).filter(msg => msg.role !== 'system');
      session.messages = systemMessage ? [systemMessage, ...recentMessages] : recentMessages;
    }

    // Format the history for Gemini API
    // We need to exclude the system message as Gemini handles it differently
    const contentMessages = session.messages.filter(msg => msg.role !== 'system');

    // Get system message if it exists
    const systemMessage = session.messages.find(msg => msg.role === 'system')?.parts[0].text || '';

    // Using Google's Gemini API
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
    
    // Check if there's an error in the API response
    if (data.error) {
      console.error('Gemini API error:', data.error);
      return "I'm having trouble processing your question right now. Please try asking something else.";
    }
    
    // Extract text from the response
    const geminiMessage = data.candidates[0].content.parts[0].text;
    
    // Save the assistant's response to the session
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

// Handle simple responses without needing AI
export function getSimpleResponse(message: string): string | null {
  const normalizedMessage = message.toLowerCase().trim();
  
  // Simple greeting responses
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
  
  // No simple match
  return null;
}

// Function to get suggested questions
export function getSuggestedQuestions(): string[] {
  // Get common questions from FAQ, skipping greeting FAQs
  return faqs.slice(2, 8).map(faq => faq.question);
}