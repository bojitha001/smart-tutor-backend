import mongoose from "mongoose"

const teachersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    }
})

const Teacher = mongoose.model("Teacher", teachersSchema);
export default Teacher;