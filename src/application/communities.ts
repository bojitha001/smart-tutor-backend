import { Request, Response } from "express";
import Community from "../infrastructure/schemas/communities";

export const getAllCommunities = async (req: Request, res: Response) => {
  const communities = await Community.find();
  return res.status(200).json(communities);
};

export const getCommunityById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const community = await Community.findById(id);
  if (community === null) {
    return res.status(404).send();
  }
  return res.status(200).json(community);
};

export const addCommunity = async (req: Request, res: Response) => {
  // console.log(req.body)
  // availableTeachers.push(req.body);
  const commmunity = req.body;
  await Community.create(commmunity);
  return res.status(201).send();
};
