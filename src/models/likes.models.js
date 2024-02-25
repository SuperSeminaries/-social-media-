import mongoose from "mongoose";
import { Post } from "./post.models.js";
import { User } from "./user.models.js";

const likesSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

})

export const Likes = mongoose.model("Likes", likesSchema)