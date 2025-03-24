import { Request, Response } from "express";
import Announcement from "../infrastructure/schemas/announcements";
import Teacher from "../infrastructure/schemas/availableTeachers";

export const getAllAnnouncements = async (req: Request, res: Response) => {
  const announcements = await Announcement.find();
  return res.status(200).json(announcements);
};

export const addAnnouncement = async (req: Request, res: Response) => {
  const announcement = req.body;
  await Announcement.create(announcement);
  return res.status(201).send();
};

// export const getAnnouncementByTutorClerkId = async (
//   req: Request,
//   res: Response
// ) => {
//   const { clerkId } = req.params;
//   console.log("Looking for tutor id", clerkId);

//   const tutor = await Teacher.findOne({ clerkId });
//   console.log("Tutor found", tutor);

//   if (!tutor) {
//     return res.status(404).json({ message: "Tutor not found" });
//   }

//   const announcements = await Announcement.find({ tutorID: tutor._id })
//     .populate("tutorID", "name userImageUrl")
//     .exec();
//     console.log(announcements);
//     return res.status(200).json(announcements);
// };


export const getAnnouncementById = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(req.params.id)
    const announcement = await Announcement.find({ tutorID: id });
    if (announcement === null) {
      return res.status(404).send();
    }
    return res.status(200).json(announcement);
  };