import mongoose from "mongoose";
import { User } from "./user.models.js";
import { Likes } from "./likes.models.js";

// const postSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       // required: true
//     },
//     content: {
//       type: String,
//       // required: true
//     },
//     img: {
//       type: String
//     },
//     author: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Reference to Author model
//       required: true,
//     },
//     createdAt: {
//       type: Date,
//       default: Date.now,
//     },
//     tags: [String],
//     comments: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Comment", // Reference to Comment model
//       },
//     ],
//     likes: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Likes", // Reference to Like model
       
//       },
//     ],
//   },
//   { timestamps: true }
// );

const postSchema = new mongoose.Schema({
  content: {
    type: String, 
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Likes"
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Comment'
  }]

},{timestamps:true})

export const Post = mongoose.model("Post", postSchema);


