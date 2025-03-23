import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    // userId: {
    //     type: String,
    //     required: true,
    //     unique: true
    // },
    // name: {
    //     type: String,
    //     required: true,
    // },
    // email: {
    //     type: String,
    //     unique: true,
    //     sparse: true
    // },
    // profileImage: {
    //     type: String
    // },
    // createdAt: {
    //     type: Date,
    //     default: Date.now
    // },

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
      grade: {
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
      keyWords: {
        type: [String],
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
      lessons: {
        type: String,
        // required: true,
      },    
})

const Student = mongoose.model("Student", studentSchema);
export default Student;