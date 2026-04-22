const express = require("express");
const { getLeaderboard, updateProfile, uploadAvatarPhoto, getContributionStats, getMyNotes, toggleSaveNote, getSavedNotes } = require("../controllers/user.controller");

const { protect } = require("../middlewares/auth.middleware");
const uploadAvatar = require("../middlewares/uploadAvatar");

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.patch("/profile", protect, updateProfile);
router.post("/avatar", protect, uploadAvatar.single("avatar"), uploadAvatarPhoto);
router.get("/stats", protect, getContributionStats);
router.get("/notes", protect, getMyNotes);
router.post("/save-note", protect, toggleSaveNote);
router.get("/saved-notes", protect, getSavedNotes);


module.exports = router;
