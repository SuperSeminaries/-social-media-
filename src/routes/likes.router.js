import  Router  from "express";
import { createPost, updatePost } from "../controllers/post.controllers.js";
import { verifyjwt } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { createLike, getAllLikes } from "../controllers/likes.controllers.js";

const router = Router();

router.route("/likes").post( createLike)
router.route("/likes").post( getAllLikes)
// router.route('/updatePost').put(verifyjwt, updatePost)    

export default router
