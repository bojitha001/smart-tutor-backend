import mongoose from "mongoose";

const answersSchema = new mongoose.Schema({
    answers: {
        type: [String],
        required: true,
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CommunityQuestionForm",
        require: true,
    },
});

const Answer = mongoose.model('Answer', answersSchema);

export default Answer;