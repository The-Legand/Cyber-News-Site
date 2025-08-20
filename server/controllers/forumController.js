const {createPost, getAllPosts,getPostById} = require("../models/postModel")
const {hasMinLength, hasMaxLength}= require("../utils/validators");

async function createPostController(req,res){
    const userId = req.user.id;
    const title = req.body.title;
    const content = req.body.content;
    if(!hasMinLength(8, title)&&hasMaxLength(200,title)){
        return res.status(400).json({error:"title must be at least 8 chars and no longth then 200"})
    }

    if(!hasMinLength(15, content)){
        return res.status(400).json({error:"content must be at least 15 chars"})
    }
    const createdPost = await createPost({userId, title, content});
    return res.status(201).json({post: createdPost});
}

async function listPostsController(req, res) {
    const posts = await getAllPosts();
    return res.status(200).json({posts});
    
}


async function getPostByIdController(req, res){
    const id = Number(req.params.id);
    if(!Number.isInteger(id)|| id <=0){
        return res.status(400).json({error: "Invalid post id"});
    }
    const post = await getPostById(id);
    if(!post){
        return res.status(404).json({error: "Post not found"});
    }
    return res.status(200).json({post});
}
module.exports = {createPostController, listPostsController, getPostByIdController};