import Student from "../infrastructure/schemas/students";
import { clerkClient } from '@clerk/clerk-sdk-node';

export const getALlStudents =  async (req, res) => {
    const students =  await Student.find();
    return res.status(200).json(students);
}


export const addStudent = async (req, res) => {
    const student = req.body;
    await Student.create(student);
    return res.status(201).send();
}

export const getStudentById = async (req, res) => {
    console.log(req.params);
    const student = await Student.findById(req.params.id);
    if(!student) {
        return res.status(404).send();
    }
    return res.status(student);
}

export const createStudent = async (req, res) => {
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