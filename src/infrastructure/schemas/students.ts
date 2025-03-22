import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        sparse: true
    },
    profileImage: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
    
})

const Student = mongoose.model("Student", studentSchema);
export default Student;