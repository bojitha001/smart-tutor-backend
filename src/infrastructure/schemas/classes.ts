import mongoose from "mongoose";

const classesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    // teacher: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Teacher",
    //     // required: true,
    // },
    teacherClerkId: {
        type: String,
        required: true
    },
    student: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    }],
    studentClerkId: [{
        type: String
    }]
});
 
const Class = mongoose.model("Class", classesSchema);
export default Class;