import mongoose from "mongoose";

const communitiesSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true,
    },
    members:{
        type: String,
        require:true,
    },
    imageUrl: {
        type: String
    }
});

const Community = mongoose.model("Community", communitiesSchema);
export default Community;