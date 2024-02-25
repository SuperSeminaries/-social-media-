import express from "express";
import cookieParser from "cookie-parser";

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

import userRoutes from "./src/routes/user.routes.js"
import postRoutes from "./src/routes/post.routes.js"

app.use("/api/users", userRoutes)
app.use("/api/post", postRoutes )


export { app }
