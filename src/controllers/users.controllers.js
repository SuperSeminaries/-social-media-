import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  if (
    [userName, email, password].some(
      (fildes) => !fildes || fildes.trim() === ""
    )
  ) {
    return res.status(400).json({ message: "All fildes are required" });
  }

  const existedUser = await User.findOne({ $or: [{ email }, { userName }] });
  if (existedUser) {
    // If a user with the provided email or username already exists
    console.error("User with the provided email or username already exists");
    return res.status(400).json({
      message: "User with the provided email or username already exists",
    });
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImgLocalPath = req.files?.coverImg[0]?.path;

  if (!avatarLocalPath) {
    throw new Error("Avatar local path is missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImg = await uploadOnCloudinary(coverImgLocalPath);

  if (!avatar) {
    return res.status(400).json({ error: "Avatar file upload failed" });
  }

  const user = await User.create({
    userName,
    email,
    password,
    avatar: avatar.url,
    coverImg:  coverImg && coverImg.url || "" //coverImg?.url || "",
  });

  const createdUser = await User.findById(user._id).select(
    " -password -referenceToken"
  );

  if (!createdUser) {
    return res.status(500).json({ error: "User creation failed" }); // Corrected error message
  }

  // Respond with the created user object
  return res.status(201).json({ user: createdUser }); // Renamed key to 'user' for clarity
};

const generateAccessTokenAndReferenceToken = async (userId) => {
  const user = await User.findById(userId);
  const accessToken = await user.generateAccessToken();
  const referenceToken = await user.generateReferenceToken();

  user.referenceToken = referenceToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, referenceToken };
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    let errors = {};
    if (!email) {
      errors.email = "email is required";
    }
    if (!password) {
      errors.password = "password is required";
    }
    return res.status(400).json(errors);
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ user: "email does not exist" });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    return res.status(401).json({ password: "wrong password" });
  }

  const { accessToken, referenceToken } =
    await generateAccessTokenAndReferenceToken(user._id);

  const loginUsers = await User.findById(user._id).select(
    " -password -referenceToken "
  );

  // console.log("rr", user.referenceToken);
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("referenceToken", referenceToken, options)
    .json({ accessToken, referenceToken, message: "User login successfully" });
};

const logOutUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { referenceToken: undefined } },
      { new: true }
    );

    const option = {
      httpOnly: true,
      secure: true,
    };
    res.clearCookie("accessToken", option);
    res.clearCookie("referenceToken", option);

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const refreshAccesToken = async (req, res) => {
  const incomingRefressToken =
    req.cookies.referenceToken || req.body.refreshToken;

  if (!incomingRefressToken) {
    res.status(400).json({ message: "unAuthorized request" });
  }

  const decoded = Jwt.verify(
    incomingRefressToken,
    process.env.REFERENCE_TOKEN_SECRET
  );

  const user = await User.findById(decoded._id);

  if (!user) {
    return res.status(401).json({ message: "invalid RefressToken" });
  }

  if (incomingRefressToken !== user?.referenceToken) {
    res.status(400).json({ message: " RefressToken expire" });
  }

  const { accessToken, referenceToken: newReferenceToken } =
    await generateAccessTokenAndReferenceToken(user._id);

  const option = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("accessToken", accessToken, option)
    .cookie("referenceToken", newReferenceToken, option)
    .json({
      accessToken,
      newReferenceToken,
      message: "refresh Token created successfully ",
    });
};

const changeCurrentPasword = async (req, res) => {
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    let errors = {};
    if (!password) {
      password.errors = "password is required";
    }

    if (!newPassword) {
      newPassword, (errors = "newPassword is required");
    }
  }
  // console.log(password, newPassword);

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!password) {
    return res.status(400).json({ message: "Invalid password" });
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res.status(200).json({ message: "Password updated successfully" });
};

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -referenceToken"
  );

  return res
    .status(200)
    .json({ user, message: "Current user fetched successfully" });
};

const updateAccountDetails = async (req, res) => {
  const { userName, email } = req.body;
  let errors = {};

  if (!userName) {
    errors.userName = "userName is required";
  }

  if (!email) {
    errors.email = "email is required";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json(errors);
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { userName, email } },
      { new: true, select: "-password -refreshToken" }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Respond with updated user details
    res.status(200).json({ user, message: "Account updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccesToken,
  changeCurrentPasword,
  getCurrentUser,
  updateAccountDetails,
};
