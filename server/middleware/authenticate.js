const {verifyJwt} = require("../utils/jwt");


function authGuard(req,res,next){
    const auth = req.headers.authorization || "";
    const [scheme, token] = auth.split(" ");

    if(scheme !=="Bearer"||!token){
        return res.status(401).json({error:"Missing or invalid authorization header"});
    }

    try{
        const payload = verifyJwt(token);
        req.user = {id:payload.id, email: payload.email, role: payload.role||"user"};
        return next();
    }
    catch(err){
        return res.status(401).json({error:"Invalid or expired token"});
    }
}



module.exports = {authGuard};