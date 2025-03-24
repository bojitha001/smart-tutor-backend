import mongoose from "mongoose";

const announcementScehma = new mongoose.Schema({
    tutorID: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});

const Announcement = mongoose.model("Announcement", announcementScehma);
export default Announcement;
