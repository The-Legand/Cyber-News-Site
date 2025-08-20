function requireAdmin(req,res,next){
    if(req.user?.role!=="admin"){
        return res.status(403).json({error:"Forbidden: admin only"});
    }
    return next();
}

function requireSelfOrAdmin(req, res, next){
    const isAdmin = req.user?.role === "admin";
    const isSelf = String(req.user?.id)===String(req.params.id);
    if(isAdmin || isSelf) return next();
    return res.status(403).json({error: "Forbidden: not allowed to access this user"});
}

module.exports = {requireAdmin, requireSelfOrAdmin}