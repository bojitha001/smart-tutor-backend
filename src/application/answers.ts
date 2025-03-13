import { Request, Response } from "express";
import Answer from "../infrastructure/schemas/answers";

export const addAnswer = async (req: Request, res: Response) => {
  const answer = req.body;
  await Answer.create(answer);
  return res.status(201).send();
};

export const getAnswerByQuestionId = async (req: Request, res: Response) => {
  const { questionId } = req.query;
  console.log(questionId);
  if (questionId) {
    const answer = await Answer.find({ question: questionId });
    return res.status(200).json(answer);
  }
  const answer = await Answer.find().populate("question").exec();
  return res.status(200).json(answer);
};
