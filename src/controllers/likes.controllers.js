import { Likes } from "../models/likes.models.js";
import { Post } from "../models/post.models.js";

// Controller function to create a new like
const createLike = async (req, res) => {
  try {
    const userId = req.body.author;
    const postId = req.params.id;

    // Check if postId and userId are provided
    if (!postId || !userId) {
      return res
        .status(400)
        .json({ message: "postId and userId are required" });
    }

    // Create a new like
    const like = await Likes.create({ post: postId, author: userId });

    // Check if like creation was successful
    if (!like) {
      return res.status(500).json({ message: "Failed to create like" });
    }

    // Update the corresponding post to include the new like
    await Post.findByIdAndUpdate(postId, { $push: { likes: like._id } });

    res.status(201).json({ like, message: "Like created successfully" });
  } catch (error) {
    console.error("Error creating like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller function to get  likes
const getLike = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find all likes for the specified post
    const likes = await Likes.find({ post: postId });

    // Return the likes
    res.status(200).json(likes);
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: error.message });
  }
};

// Controller function to deleteLike all likes
const deleteLike = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.body.author;

    // Check if postId and userId are provided
    if (!postId || !userId) {
      return res
        .status(400)
        .json({ message: "postId and userId are required" });
    }

    // Find the like to delete
    const like = await Likes.findOneAndDelete({ post: postId, author: userId });

    // Check if the like was found and deleted
    if (!like) {
      return res.status(404).json({ message: "Like not found" });
    }

    // Update the corresponding post to remove the deleted like
    await Post.findByIdAndUpdate(postId, { $pull: { likes: like._id } });

    // Return success response
    res.status(200).json({ message: "Like deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error deleting like:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export { createLike, getLike, deleteLike };
