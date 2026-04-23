const express = require("express");
const { 
  createDiscussion, 
  getDiscussionsBySubject, 
  addReply, 
  toggleLike 
} = require("../controllers/discussion.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/:subject", getDiscussionsBySubject);
router.post("/", protect, createDiscussion);
router.post("/:id/reply", protect, addReply);
router.post("/:id/like", protect, toggleLike);

module.exports = router;
