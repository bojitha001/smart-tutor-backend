import Student from "../infrastructure/schemas/students";
import { clerkClient } from '@clerk/clerk-sdk-node';
import { Request, Response } from "express";

export const getALlStudents =  async (req:Request, res: Response) => {
    const students =  await Student.find();
    return res.status(200).json(students);
}


export const addStudent = async (req:Request, res: Response) => {
    const student = req.body;
    await Student.create(student);
    return res.status(201).send();
}

export const getStudentById = async (req:Request, res: Response) => {
    console.log(req.params);
    const student = await Student.findById(req.params.id);
    if(!student) {
        return res.status(404).send();
    }
    return res.status(200).send(student);
}

export const createStudent = async (req:Request, res: Response) => {
    try {
      const { userId, name, email, profileImage } = req.body;
  
      // Create student data
      const studentData = {
        clerkId: userId,
        name: name || `User_${userId.slice(-5)}`,
        email: email || '',
        profileImage: profileImage || ''
      };
  
      // Create and save new student
      const newStudent = new Student(studentData);
      await newStudent.save();
  
      return res.status(201).json(newStudent);
    } catch (error) {
      console.error('Error creating student:', error);
      
      // Comprehensive error handling
      if (error.name === 'ValidationError') {
        return res.status(400).json({ 
          message: 'Validation Error',
          details: Object.values(error.errors).map(err => ({
            field: err.path,
            message: err.message
          }))
        });
      }
  
      return res.status(500).json({ 
        message: 'Error creating student', 
        error: error.message 
      });
    }
  };