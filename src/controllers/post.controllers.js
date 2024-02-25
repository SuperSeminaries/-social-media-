import { Post } from "../models/post.models.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";



const createPost = async (req, res) => {
    try {
        // Create a new Post instance with userId extracted from req.user._id
        const newPost = new Post({...req.body, author:req.user._id});

        // Access imgPath using optional chaining and set to null if not found
        const imgPath = req.files?.img?.[0]?.path || null;

        // Upload image to Cloudinary (Assuming uploadOnCloudinary works correctly)
        const cloudinaryResponse = await uploadOnCloudinary(imgPath);

        // Set the img field of the new post to the Cloudinary URL if available, or an empty string otherwise
        newPost.img = (cloudinaryResponse && cloudinaryResponse.url) || "";

        // Save the new post to the database
        const savedPost = await newPost.save();

        // Respond with the saved post
        res.status(201).json({ post: savedPost, message: "Post successfully created" });
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


const updatePost = async (req, res) => {
    const user = req.user._id;
    try {
        // Find the post by the author's ID
        const existingPost = await Post.findOne({ author: user });
        if (!existingPost) {
            return res.status(404).json({ message: "No post found for the user" });
        }

        // Check if req.body contains data
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "No update post data provided" });
        }

        // Find the post by the author's ID and update it with the request body
        const updatedPost = await Post.findOneAndUpdate({ author: user }, req.body);
        if (!updatedPost) {
            return res.status(404).json({ message: "No post found for the user" });
        }
        res.status(200).json("The post has been updated");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


 const deletePost = async (req, res) => {
    const userId = req.user._id;

    try {
        // Find the post by the author's ID
        const existingPost = await Post.findOne({author: userId});

        if (!existingPost) {
            return res.status(404).json({ message: "No post found for the user" });
        }

        // Delete the post
        await Post.findByIdAndDelete(existingPost._id);

        res.status(200).json("The post has been deleted");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const getPost = async (req, res) => {
    try {
        // Find all posts
        const allPosts = await Post.find();
    
        res.status(200).json(allPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}


// Assuming req.user contains the current user's information
// const timeline = async (req, res) => {
//     try {
//         const currentUser = req.user._id; // Assuming you have user ID in req.user._id

//         // Find users followed by the current user
//         const user = await User.findById(currentUser).populate('following', '_id');

//         // Extract the IDs of followed users
//         const followedUsers = user.following.map(user => user._id);

//         // Find posts authored by followed users
//         const timelinePosts = await Post.find({ author: { $in: followedUsers } }).sort({ createdAt: -1 });

//         res.status(200).json(timelinePosts);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };



export { createPost, updatePost, deletePost, getPost }