const express = require("express");
const { getLeaderboard, updateProfile } = require("../controllers/user.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.patch("/profile", protect, updateProfile);

module.exports = router;
