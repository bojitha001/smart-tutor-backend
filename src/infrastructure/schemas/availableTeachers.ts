import mongoose from "mongoose";

const teachersSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  userImageUrl: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  contactNo: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    // required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    // required: true,
  },
  reviews: {
    type: String,
    // required: true,
  },
  lessons: {
    type: String,
    // required: true,
  },
});

const Teacher = mongoose.model("Teacher", teachersSchema);
export default Teacher;
