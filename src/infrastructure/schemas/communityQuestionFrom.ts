import mongoose from "mongoose";

const communityQuestionForm = new mongoose.Schema({
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
    topic: {
        type:String,
        required: true,
    },
    questions: {
        type:String,
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId, //Represents the type of the job (The object Id that creates from the mongoode schema)
        ref: "Community", //reference to the Community
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const CommunityQuestionForm = mongoose.model('CommunityQuestionForm',communityQuestionForm );

export default CommunityQuestionForm;
