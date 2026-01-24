const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/auth.controller");
const { getProfile, updateProfile } = require("../controllers/user.controller");
const {
  predictActivity,
  getActivities,
  getLatestActivity,
} = require("../controllers/activity.controller");
const authMiddleware = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

router.post("/activity/predict", authMiddleware, predictActivity);
router.get("/activities", authMiddleware, getActivities);
router.get("/activity/latest", authMiddleware, getLatestActivity);

module.exports = router;
