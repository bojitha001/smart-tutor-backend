import { Request, Response } from "express";
import Booking from "../infrastructure/schemas/bookings";
import Teacher from "../infrastructure/schemas/availableTeachers";

export const createBooking = async (req: Request, res: Response) => {
  const bookingData = req.body;
  const newBooking = await Booking.create(bookingData);
  return res.status(201).send(newBooking);
};

export const getBookingByTutorClerkId = async (req: Request, res: Response) => {
  const { clerkId } = req.params;
  console.log("Looking for tutor with Clerk ID:", clerkId);

  const tutor = await Teacher.findOne({ clerkId });
  console.log("Tutor found:", tutor);

  // const tutor = await Teacher.findOne({clerkId});
  if (!tutor) {
    return res.status(404).json({ message: "Tutor not found" });
  }

  const bookings = await Booking.find({ tutorID: tutor._id })
    .populate("tutorID", "name userImageUrl")
    .exec();
  console.log(bookings);
  return res.status(200).json(bookings);
};
