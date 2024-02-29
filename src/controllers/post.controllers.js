import { Post } from "../models/post.models.js";

// get all getAllPosts
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find();

    // Check if no posts were found
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found" });
    }

    // Return successful response with the found posts
    res.status(200).json({ posts });
  } catch (error) {
    // Handle other errors (e.g., database errors)
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// createPosts
const createPosts = async (req, res) => {
  try {
    const { content, author } = req.body;

    // Validate content and author fields
    if (!content || !author) {
      let errors = {};
      if (!content) {
        errors.content = "Content is required";
      }
      if (!author) {
        errors.author = "Author is required";
      }
      return res.status(400).json({ errors });
    }

    // Create new post
    const newPost = await Post.create({ content, author });

    // Return successful response with the newly created post
    res.status(200).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//get a specific post
const getPostsById = async (req, res) => {
  try {
    // checking postId from request parameters
    const postId = req.params.id;

    // Check if postId is missing or empty
    if (!postId) {
      return res.status(400).json({ message: "ID is required" });
    }

    // Fetch post from database by postId
    const post = await Post.findById(postId);

    // If no post is found, return a 404 response
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Return the found post in a 200 response
    res.status(200).json(post);
  } catch (error) {
    // If an error occurs during the database query, return a 500 response
    console.error("Error fetching post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



//Updates a specific post.
const updatePost = async (req, res) => {
  const postId = req.params.id;
  if (!postId) {
    return res.status(400).json({ message: "ID is required" });
  }

  const { content } = req.body;
  if (!content || content.trim().length === 0) {
    return res.status(400).json({ message: "Content cannot be empty" });
  }

  try {
    const post = await Post.findByIdAndUpdate(postId, { content }, { new: true });
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({ post });
  } catch (error) {
    console.error("Error updating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// Deletes a specific post
const deletePostById = async (req, res) => {
  const postId = req.params.id;
  
  try {
      // Find the post by ID and delete it
      const deletedPost = await Post.findByIdAndDelete(postId);

      // Check if the post was found and deleted
      if (!deletedPost) {
          return res.status(404).json({ message: "Post not found" });
      }

  
      res.status(200).json(deletedPost, { message: "Post deleted successfully" });
  } catch (error) {
      
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Internal server error" });
  }
};



export { getAllPosts, createPosts, getPostsById, updatePost, deletePostById };
