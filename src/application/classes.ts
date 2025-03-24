import Class from "../infrastructure/schemas/classes";
import Teacher from "../infrastructure/schemas/availableTeachers";
import Student from "../infrastructure/schemas/students";
import { Request, Response } from "express";

export const getAllClasses = async (req:Request, res: Response) => {
  const classes = await Class.find();
  return res.status(200).json(classes);
};

export const addClass = async (req:Request, res: Response) => {
  const addClass = req.body;
  await Class.create(addClass);
  return res.status(201).send();
};

export const getClassById = async (req:Request, res: Response) => {
  console.log(req.params);
  const getClass = await Class.findById(req.params.id);
  if (!getClass) {
    return res.status(404).send();
  }
  return res.status(200).json(getClass);
};

export const getClass = async (req:Request, res: Response) => {
    const { teacherClerkId, studentClerkId } = req.query;
  
    try {
      // If teacherClerkId is provided
      if (teacherClerkId) {
        const classes = await Class.find({ teacherClerkId })
          .populate({
            path: 'teacherClerkId',
            select: 'name subject degree clerkId'
          })
          .populate({
            path: 'studentClerkId',
            select: 'name clerkId'
          });
  
        console.log('Found Classes:', classes);
  
        if (classes.length === 0) {
          return res.status(404).json({
            message: "No classes found for this teacher"
          });
        }
  
        return res.status(200).json(classes);
      }
  
      // If studentClerkId is provided
      if (studentClerkId) {
        const classes = await Class.find({ studentClerkIds: studentClerkId })
          .populate({
            path: 'teacher',
            select: 'name subject degree clerkId'
          })
          .populate({
            path: 'student',
            select: 'name clerkId'
          });
  
        if (classes.length === 0) {
          return res.status(404).json({
            message: "No classes found for this student"
          });
        }
  
        return res.status(200).json(classes);
      }
  
      // If no filter provided, return all classes
      const classes = await Class.find()
        .populate({
          path: 'teacher',
          select: 'name subject degree clerkId'
        })
        .populate({
          path: 'student',
          select: 'name clerkId'
        });
  
      return res.status(200).json(classes);
  
    } catch (error) {
      console.error('Error fetching classes:', error);
      return res.status(500).json({
        message: 'Internal server error',
        // error: error.message
      });
    }
  };

  