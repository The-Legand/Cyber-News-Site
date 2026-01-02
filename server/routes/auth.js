const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const {login, signup,loginSession, logoutSession, meSession} = require("../controllers/authController");

router.post("/login", asyncHandler(login));
router.post("/signup",asyncHandler(signup));

router.post("/login-session", asyncHandler(loginSession));
router.post("/logout-session", asyncHandler(logoutSession));
router.get("/me-session", asyncHandler(meSession));
module.exports = router;