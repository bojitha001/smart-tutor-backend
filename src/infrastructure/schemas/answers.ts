import mongoose from "mongoose";

const answersSchema = new mongoose.Schema({
    userId: {
        type:String,
        required: true,
    },
    userImageUrl: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    answers: {
        type: [String],
        required: true,
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommunityQuestionForm",
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Answer = mongoose.model('Answer', answersSchema);

export default Answer;