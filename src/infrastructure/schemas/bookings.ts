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
  studentEmail: {
    type: String,
    required: true,
  },
  studentImageUrl: {
    type: String,
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Done'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Booking = mongoose.model("Booking", bookingsSchema);
export default Booking;