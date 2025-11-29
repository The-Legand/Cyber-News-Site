const {createPost, getAllPosts,getPostById, updatePostById, deletePostById} = require("../models/postModel")
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
        return res.status(404).json({error: "post not found"});
    }
    return res.status(200).json(post);
}

async function updatePostController(req, res) {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0){
        return res.status(400).json({error: "Invalid post id"});
    }

    const post = getPostById(id);
    if(!post){
        return res.status(404).json({error:"Post not found"});
    }

    if(req.user.id !== post.user_id&& req.user.role!=='admin'){
        return res.status(403).json({error:'Forbidden'});

    }

    const title = req.body.title;
    const content = req.body.content;
    if(!hasMinLength(8,title)||hasMaxLength(200,title)){
        return res.status(400).json({error:"title must be between 8-200 chars"})
    }

    if(!hasMinLength(15, content)){
        return res.status(200).json({error:"Contenet must be at least 50 chars"});
    }

    const updated = await updatePostById(id, title, content);
    if(!updated){
        return res.status(500).json({error: "Update failed"});
    }
    return res.status(200).json(updated);
    }
async function deletePostController(req, res){
    const id = Number(req.params.id);

    if(!Number.isInteger(id)|| id <=0){
        return res.status(400).json({error:"Invalid id"});
    }
    const post = await getPostById(id);
    if(!post){
        return res.status(404).json({error: "Post not found"});
    }
    if(req.user.role!=="admin"&& post.user_id!=req.user.id){
        return res.status(403).json({error: 'Forbidden. only the post owner can delete this post'
        })
    }


    const ok = await deletePostById(id);
    if(!ok){
        return res.status(500).json({Error:"Couldn't delete"});
    }

    return res.json({message: "Post deleted"});
}


module.exports = {createPostController, listPostsController, getPostByIdController, updatePostController, deletePostController};