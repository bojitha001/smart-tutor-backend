import { Request, Response } from 'express';
import { 
  getResponseFromFAQ, 
  getGeminiResponse, 
  getSimpleResponse,
  getSuggestedQuestions
} from '../../infrastructure/services/chatbotService';


export const handleChatMessage = async (req: Request, res: Response) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    console.log(`Received message from session ${sessionId}:`, message);
    
    
    const simpleResponse = getSimpleResponse(message);
    if (simpleResponse) {
      return res.status(200).json({
        response: simpleResponse,
        source: 'simple'
      });
    }

    
    const faqResponse = getResponseFromFAQ(message);
    console.log('FAQ response confidence:', faqResponse.confidence);

   
    if (faqResponse.confidence > 0.6) {
      return res.status(200).json({
        response: faqResponse.answer,
        source: 'faq'
      });
    }

    
    console.log('No good FAQ match, using Gemini API for session', sessionId);
    const geminiResponse = await getGeminiResponse(sessionId, message);
    
    return res.status(200).json({
      response: geminiResponse,
      source: 'gemini'
    });
  } catch (error) {
    console.error('Error handling message:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getQuestionSuggestions = (req: Request, res: Response) => {
  try {
    const suggestions = getSuggestedQuestions();
    return res.status(200).json({ suggestions });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};