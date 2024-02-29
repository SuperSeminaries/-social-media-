import express from "express";
import cookieParser from "cookie-parser";

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

import userRoutes from "./src/routes/user.routes.js"
import post from './src/routes/post.router.js'

app.use("/api/users", userRoutes)
// app.use("/api/post", postRoutes )
app.use("/api/posts", post )


export { app }
