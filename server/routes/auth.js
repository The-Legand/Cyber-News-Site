const express = require("express");
const router = express.Router();
const asyncHandler = require("../utils/asyncHandler");
const {login, signup} = require("../controllers/authController");

router.post("/login", asyncHandler(login));

router.post("/signup",asyncHandler(signup));

module.exports = router;