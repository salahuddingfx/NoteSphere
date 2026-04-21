const express = require("express");
const { getLeaderboard, updateProfile, uploadAvatarPhoto, getContributionStats, getMyNotes } = require("../controllers/user.controller");

const { protect } = require("../middlewares/auth.middleware");
const uploadAvatar = require("../middlewares/uploadAvatar");

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.patch("/profile", protect, updateProfile);
router.post("/avatar", protect, uploadAvatar.single("avatar"), uploadAvatarPhoto);
router.get("/stats", protect, getContributionStats);
router.get("/notes", protect, getMyNotes);


module.exports = router;
