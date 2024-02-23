import mongoose from "mongoose";
// Define User Schema
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: "",
  },
  coverImg: {
    type: String,
    default: "",
  },
  desc: {
    type: String,
    max: 50,
  },
  followers: {
    type: Array,
    default: [],
  },
  followings: {
    type: Array,
    default: [],
  },
  city: {
    type: String,
    max: 50,
  },
  from: {
    type: String,
    max: 50,
  },
  relationship: {
    type: Number,
    enum: [1, 2, 3],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
    timeseries: true
});



// Create User model
export const User = mongoose.model("User", userSchema)
