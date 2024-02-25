import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
// Define User Schema
const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    referenceToken: {
      type: String,
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
      default: Date.now,
    },
  },
  {
    timeseries: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.isPasswordCorrect = async function (password) {
  try {
   return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
    console.log('ispass',error);
  }
};

userSchema.methods.generateAccessToken = async function () {
  return Jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });
};

userSchema.methods.generateReferenceToken = async function () {
  return Jwt.sign({ _id: this._id }, process.env.REFERENCE_TOKEN_SECRET, {
    expiresIn: process.env.REFERENCE_TOKEN_EXPIRE,
  });
};

// Create User model
export const User = mongoose.model("User", userSchema);
