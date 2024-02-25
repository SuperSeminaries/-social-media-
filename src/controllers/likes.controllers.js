import { Likes } from "../models/likes.models.js";
import { Post } from "../models/post.models.js";

// Controller function to create a new like
const createLike = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming you have the user ID in req.user._id

    const post = await Post.findOne({ author: userId });
    if (!post) {
      return res
        .status(404)
        .json({ message: "No post found for the current user." });
    }
    // Find the like associated with the post and user
    const like = await Likes.findOne({ post: post._id, author: userId });

    if (like) {
      // If a like exists, delete it (dislike)
      await Likes.findByIdAndDelete(like._id);
      await Post.findByIdAndUpdate(post._id, { $pull: { likes: like._id } });
      res.status(200).json({ message: "Disliked post successfully." });
    } else {
      // If no like exists, create a new like (like)
      const newLike = await Likes.create({ post: post._id, author: userId });
      await Post.findByIdAndUpdate(post._id, { $push: { likes: newLike._id } });
      res
        .status(201)
        .json({ like: newLike, message: "Liked post successfully." });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get all likes
const getAllLikes = async (req, res) => {
  try {
    const likes = await Likes.find();
    res.status(200).json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { createLike, getAllLikes };
