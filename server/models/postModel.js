const db = require("../db");


async function createPost({userId, title, content}){
    const [result] = await db.query(
        "INSERT INTO posts (user_id, title, content) VALUES(?, ?, ?)",[userId, title, content]
    );
    const [rows] = await db.query("SELECT * FROM posts where id = ?", [result.insertId]);
    return rows[0];
}

async function getAllPosts(){
    const [rows] = await db.query(
        "SELECT p.id, p.title, p.content, p.created_at, p.updated_at, u.username AS author FROM posts p JOIN users u ON u.id = p.user_id ORDER BY p.created_at DESC"
    );
    return rows;
}

async function getPostById(id){
    const [rows] = await db.query("SELECT p.id, p.title, p.content, p.created_at, p.updated_at,p.user_id, u.username AS author FROM posts p JOIN users u ON u.id = p.user_id WHERE p.id = ?",[id]);
    return rows[0];

}

async function updatePostById(id, title, content){
    
    const [result] = await db.query("UPDATE posts set title = ?, content = ?, updated_at = NOW() WHERE id = ?",[title, content, id]);

    if(result.affectedRows===0) return null;
    
    return getPostById(id);
}

async function deletePostById(id){
    
    const [result] = await db.query(
        "DELETE FROM posts where id = ?",[id]
    );
    console.log(result);
    
    console.log(result.affectedRows > 0);
    return result.affectedRows > 0;
}
module.exports = {createPost, getAllPosts, getPostById, updatePostById, deletePostById};