import mongoose from "mongoose";
import { User } from "./user.models.js";


const commentSchema = new mongoose.Schema({
    content: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    
  });
  
 export const Comment = mongoose.model('Comment', commentSchema);
  

  