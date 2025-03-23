import mongoose from "mongoose";

const bookingsSchema = new mongoose.Schema({
  tutorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true,
  },
  studentId: {
    type: String,
    required: true,
  },
  studentName: {
    type: String,
    required: true,
  },
  studentImageUrl: {
    type: String,
  },
});

const Booking = mongoose.model("Booking", bookingsSchema);
export default Booking;