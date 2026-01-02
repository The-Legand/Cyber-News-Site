const bcrypt = require("bcryptjs");
const {getUserAuthByEmail, createUser, getUserByEmail} = require("../models/userModel");
const {isEmail, isNonEmptyString, isStrongPassword} = require("../utils/validators");
const {signJwt} = require("../utils/jwt");

async function loginSession(req,res){
    const { email, password} = req.body

    if(!email || !password){
        return res.status(400).json({error:"Email or password are required"
        });
    }

    const user = await getUserAuthByEmail(email);

    if(!user){
        return res.status(401).json({error: "Invalid credentials"
        });
    }

    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok){
        return res.status(401).json({error:"Invalid credentials"});

    }

    req.session.regenerate(err => {
        if(err){
            return res.status(500).json({error: "Session error"});
        }

        req.session.user = {
            id: user.id,
            role: user.role,
            email: user.email,
            username: user.username
        };
        res.status(200).json({message: "Logged in with session"});
    });


}

async function logoutSession(req,res){
    req.session.destroy((err)=>{
        if (err) return res.status(500).json({error: "Logout failed"});

        res.clearCookie("cybernews.sid",{
            path: "/",
            sameSite: "lax",
            secure: false,
            httpOnly: true,
        });
        return res.status(200).json({message: "Logged out session"});
    });
}
async function meSession(req,res){

    if(!req.session?.user){
        return res.status(401).json({error:"Not authenticated"});
    }
   

    return res.status(200).json({user: req.session.user});
}
async function login(req,res) {
    const body = req.body;
    const email = body.email;
    const password = body.password;

    if(!email||!password){
        return res.status(400).json({error: "Email and password are required"});
    }

    if(typeof email !=="string" || typeof password !== "string"){
        return res.status(400).json({error:"Invalid request body"});
    }
    
    const userAuth = await getUserAuthByEmail(email);
    if(!userAuth){
        return res.status(401).json({error:"Invalid email or password"})
    }

    const ok = await bcrypt.compare(password,userAuth.password_hash);
    if(!ok){
            return res.status(401).json({ error: "Invalid email or password" });

    }

    const safeUser = {
        id: userAuth.id,
        username: userAuth.username,
        email: userAuth.email,
        role: userAuth.role,
        created_at: userAuth.created_at,
    };

    const token = signJwt({id: safeUser.id, email: safeUser.email, role: safeUser.role});
    return res.status(200).json({user: safeUser,token});
}

async function signup(req,res){
    const {username,email,password} = req.body;

    if(!isNonEmptyString(username)){
        return res.status(400).json({error: "username is required"});
    }
    if(!isEmail(email)){
        return res.status(400).json({error:"email is invalid"});
    }

    if(!isStrongPassword(password)){
        return res.status(400).json({error:"password must be at least 8 charecters"});
    }

    const isUserExisting = await getUserByEmail(email);
    if(isUserExisting) return res.status(409).json({error: "Email already in use"});

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await createUser({username,email,passwordHash})
    const token = signJwt({id: newUser.id, email: newUser.email,
        username:newUser.username, role:newUser.role})
    return res.status(201).json({user: newUser, token:token});
}

module.exports = { login, signup, loginSession, logoutSession, meSession };
