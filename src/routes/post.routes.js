import  Router  from "express";
import { createPost, deletePost, getPost, updatePost } from "../controllers/post.controllers.js";
import { verifyjwt } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { createLike, getAllLikes } from "../controllers/likes.controllers.js";
import { createCommit, getComment } from "../controllers/comments.controllers.js";

const router = Router();

router.route("/post").post(verifyjwt,
    upload.fields([{name: 'img'}]),
    createPost
    )
router.route('/updatePost').put(verifyjwt, updatePost)    
router.route('/deletePost').post(verifyjwt, deletePost)    
router.route('/getPost').get(verifyjwt, getPost)    
router.route("/likes").post(verifyjwt, createLike)
router.route("/likes").get(verifyjwt, getAllLikes)
router.route("/comments").post(verifyjwt, createCommit)
router.route("/comments").get(verifyjwt, getComment)


export default router
