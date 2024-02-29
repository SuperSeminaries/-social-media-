import Router from "express"
import { createComments, deleteComment, getComments, updateComment } from "../controllers/comments.controllers.js"
import { createLike, deleteLike, getLike } from "../controllers/likes.controllers.js"
import { createPosts, deletePostById, getAllPosts, getPostsById, updatePost } from "../controllers/post.controllers.js"



const router = Router()

router.route('/').get(getAllPosts)
router.route('/').post(createPosts)
router.route('/:id').get(getPostsById)
router.route('/:id').put(updatePost)
router.route('/:id').delete(deletePostById)


// Comment Routes:

router.route('/:id/comment').post(createComments) // Adds a comment to a specific post.
router.route('/:id/comment').get(getComments) // get  a comment to a specific post.
router.route('/:id/comment').put(updateComment) // update a comment to a specific post.
router.route('/:id/comment').delete(deleteComment) // delete a comment to a specific post.


// Like Routes:

router.route('/:id/likes').post(createLike) // Adds a likes to a specific post.
router.route('/:id/likes').get(getLike) // Adds a likes to a specific post.
router.route('/:id/likes').delete(deleteLike) // Adds a likes to a specific post.





export default router