
const {
    getAllUsers,
    getUser,

    
} = require("../models/userModel");




/*async function listUsers(req,res){
    const users = await getAllUsers();
    return res.status(200).json(users);
}*/

async function getUserById(req,res){
    const id = Number(req.params.id);
    if(!Number.isInteger(id)|| id <=0){
        return res.status(400).json({error: "Invalid user id"});
    }
    const rows =  await getUser(id);
    const user = rows;
    if(!user) return res.status(404).json({error:"User not found"});
    return res.status(200).json(user);
}

//getDetails of the current logged in user
async function getCurrentUser(req, res){
    const {id} = req.user;
    const user = await getUser(id);
    if(!user){
        return res.status(404).json({error: "User not found"});
    }
    return res.status(200).json(user);
}

async function listUsers(req, res){
    const {role, limit} = req.query;
    let users = await getAllUsers();

    if(role){
        users = users.filter(u =>u.role===role);
    }

    if(limit){
        users = users.slice(0, Number(limit));
    }
    return res.status(200).json({users});
}
module.exports = {listUsers, getUserById, getCurrentUser};

