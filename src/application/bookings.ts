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

export const updateBookingPaymentStatus = async (req: Request, res: Response) => {
    const { clerkId } = req.params; 
    const { bookingId, paymentStatus } = req.body; 
    
    try {
      
      const tutor = await Teacher.findOne({ clerkId });
      
      if (!tutor) {
        return res.status(404).json({ message: "Tutor not found" });
      }
      
     
      const booking = await Booking.findOneAndUpdate(
        { 
          _id: bookingId, 
          tutorID: tutor._id 
        },
        { paymentStatus },
        { new: true } 
      );
      
      if (!booking) {
        return res.status(404).json({ 
          message: "Booking not found or doesn't belong to this tutor" 
        });
      }
      
      return res.status(200).json(booking);
    } catch (error) {
      console.error("Error updating booking payment status:", error);
      return res.status(500).json({ 
        message: "Server error while updating booking payment status" 
      });
    }
  };