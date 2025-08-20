const express = require("express");
const router = express.Router();

const {createPostController,listPostsController, getPostByIdController} = require("../controllers/forumController");
const asyncHandler =  require("../utils/asyncHandler");
const {authGuard} = require("../middleware/authenticate");

//create a new post(must be signed in)
router.post("/",authGuard, asyncHandler(createPostController))

//get all posts (public)
router.get("/",asyncHandler(listPostsController));
//get post by post id (public)
router.get("/:id", asyncHandler(getPostByIdController))
module.exports=router;