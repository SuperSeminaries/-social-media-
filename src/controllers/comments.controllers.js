import { Comment } from "../models/comments.modles.js";

const createCommit = async (req, res) => {
  try {
    const { content } = req.body;
    const authorId = req.user._id; // author's ID in req.user._id

    const newComment = new Comment({ ...req.body, author: authorId }); // Create a new comment with the provided content and author ID

    const savedComment = await newComment.save();
    res
      .status(201)
      .json({ comment: savedComment, message: "Comment successfully created" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComment = async(req, res) => {
    try {
        const allComments = await Comment.find();
        res.status(200).json(allComments);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export { createCommit, getComment };
