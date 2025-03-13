import { Request, Response } from "express";
import availableTeachers from "../infrastructure/availableTeachers";
import Teacher from "../infrastructure/schemas/availableTeachers";

export const getAllAvailableTeachers = async (req: Request, res: Response) => {
  // return res.json(availableTeachers);
  const teachers = await Teacher.find();
  return res.status(200).json(teachers);
};

export const addTeachers = async (req: Request, res: Response) => {
  // console.log(req.body)
  // availableTeachers.push(req.body);
  const teacher = req.body;
  await Teacher.create(teacher);
  return res.status(201).send();
};

export const getATeacherById = async (req: Request, res: Response) => {
  console.log(req.params);
  const teacher = await Teacher.findById(req.params.id);
  if (!teacher) {
    return res.status(404).send();
  }
  return res.json(teacher);
};

export const deleteTeacher = async (req: Request, res: Response) => {
  const teacher = await Teacher.findByIdAndDelete(req.params.id);
  if (!teacher) {
    return res.status(404).send();
  }
  return res.status(204).send();
};

export const updateTeacher = async (req: Request, res: Response) => {
    const teacherToUpdate = Teacher.findById(req.params.id);
    if (!teacherToUpdate) {
        return res.status(404).send();
    }

    await Teacher.findByIdAndUpdate(req.params.id, {
        name:req.body.name,
        level:req.body.level
    })
    return res.status(204).send();
}

