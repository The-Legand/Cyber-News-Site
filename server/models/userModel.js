const db = require("../db");

async function getAllUsers(){
    
        const users = await db.query("SELECT id, username, email,role, created_at FROM users");
        return users[0];  
}

async function getUser(id){
    const [rows] = await db.query("SELECT id, username, email,role, created_at FROM users WHERE id =?",[id]);
    return rows[0];
}

async function getUserByEmail(email){
    const [rows] = await db.query("SELECT id, username, email,role, created_at FROM users WHERE email = ?",[email]);
    return rows[0];
}

async function getUserAuthByEmail(email){
    const [rows] = await db.query("SELECT id, username, email,role, password_hash, created_at FROM users WHERE email = ?",[email]);
    return rows[0];
}

async function createUser({username, email, passwordHash, role="user"}){
    const [response] = await  db.query(
            "INSERT INTO users (username, email, password_hash, role) VALUES(?,?,?,?)",
            [username, email,passwordHash,role]
        );

        const [rows] = await db.query(
            "SELECT id, username, email,role, created_at FROM users WHERE id = ?",[response.insertId]
        );
        return rows[0];
    }



module.exports = {
  getAllUsers,
  getUser,
  getUserByEmail,
  createUser,
  getUserAuthByEmail
};

