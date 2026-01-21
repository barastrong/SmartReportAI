const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { getProfile, updateProfile } = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
