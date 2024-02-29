import { Comments } from "../models/comments.modles.js";
import { Post } from "../models/post.models.js";

const createComments = async (req, res) => {
  try {
    const { content, author, postId } = req.body;

    // Validate required fields
    const errors = {};
    if (!content) {
      errors.content = "Content is required";
    }
    if (!author) {
      errors.author = "Author is required";
    }
    if (!postId) {
      errors.postId = "Post ID is required";
    }
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Create new comment
    const newComment = await Comments.create({ content, author, post: postId });

    // Check if comment was successfully created
    if (!newComment) {
      return res.status(500).json({ message: "Failed to create comment" });
    }

    // Update corresponding post to include the new comment
    await Post.findByIdAndUpdate(postId, { $push: { comments: newComment._id } });

    // Return successful response with the newly created comment
    res.status(201).json({ comments: newComment, message: "Comment successfully created" });
  } catch (error) {
   
    console.error("Error creating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await Comments.find({ post: postId });

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    
    if (!content || content.trim().length === 0) {
      return res.status(400).json({ message: "Content cannot be empty" });
    }

    // Find and update the comment
    const comment = await Comments.findOneAndUpdate(
      { post: postId },
      { content },
      { new: true }
    );

    // Check if the comment was found and updated
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update corresponding post to include the new comment
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment._id } },
      { new: true }
    );

    // Return the updated comment
    res.json(comment);
  } catch (error) {
    console.error("Error updating comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



const deleteComment = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find and delete the comment
    const comment = await Comments.findOneAndDelete({ post: postId });

    // Check if the comment was found and deleted
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Update corresponding post to remove the deleted comment
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: comment._id } },
      { new: true }
    );

    // Return success response
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export { createComments, getComments, updateComment, deleteComment };
