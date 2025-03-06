import { response } from "express";
import mongoose from "mongoose";

const kuppiGroupsScema = new mongoose.Schema({
    author: {
        type: String,
        required: true
    },
    timeAgo: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    responses: {
        type: String,
        required: true
    },
    views: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
})

const KuppiGroup = mongoose.model("KuppiGroups", kuppiGroupsScema);
export default KuppiGroup;