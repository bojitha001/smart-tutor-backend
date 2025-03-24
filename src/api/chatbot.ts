import express from "express";
import { Request, Response } from 'express';
import * as dotenv from 'dotenv';
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { handleChatMessage, getQuestionSuggestions } from './controllers/chatbotController';


dotenv.config();

const chatbotRouter = express.Router();


chatbotRouter.post('/message', handleChatMessage);


chatbotRouter.get('/suggestions', getQuestionSuggestions);

export default chatbotRouter;