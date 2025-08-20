const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const {listUsers, getUserById, getCurrentUser} = require("../controllers/usersController");
const {authGuard} = require("../middleware/authenticate");
const { requireAdmin, requireSelfOrAdmin} = require("../middleware/authorize");





//routes available only for logged in users
    //current user
    router.get("/me",authGuard, asyncHandler(getCurrentUser));

    //admin or self to access a specific user
    router.get("/:id",authGuard,requireSelfOrAdmin, asyncHandler(getUserById));

    //admin only list
    router.get("/",authGuard,requireAdmin, asyncHandler(listUsers));//list all users



module.exports = router;