import Student from "../infrastructure/schemas/students";
import { clerkClient } from '@clerk/clerk-sdk-node';
import { Request, Response } from "express";

export const getAllStudents =  async (req:Request, res: Response) => {
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
    return res.json(student);
}

export const updateStudent = async (req: Request, res: Response) => {
    const studentToUpdate = Student.findById(req.params.id);
    if(!studentToUpdate){
        return res.status(404).send();
    }

    await Student.findByIdAndUpdate(req.params.id, {
        name:req.body.name,
        level:req.body.level
    })
    return res.status(204).send();
}

// export const createStudent = async (req:Request, res: Response) => {
//     try {
//       const { userId, name, email, profileImage } = req.body;
  
     
//       const studentData = {
//         clerkId: userId,
//         name: name || `User_${userId.slice(-5)}`,
//         email: email || '',
//         profileImage: profileImage || ''
//       };
  
      
//       const newStudent = new Student(studentData);
//       await newStudent.save();
  
//       return res.status(201).json(newStudent);
//     } catch (error) {
//       console.error('Error creating student:', error);
      
      
//       if (error.name === 'ValidationError') {
//         return res.status(400).json({ 
//           message: 'Validation Error',
//           details: Object.values(error.errors).map(err => ({
//             field: err.path,
//             message: err.message
//           }))
//         });
//       }
  
//       return res.status(500).json({ 
//         message: 'Error creating student', 
//         error: error.message 
//       });
//     }
//   };