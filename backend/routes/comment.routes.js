const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  addComment,
  getNoteComments,
  deleteComment,
  toggleCommentLike,
} = require("../controllers/comment.controller");

router.route("/note/:noteId").get(getNoteComments);

router.use(protect);
router.route("/").post(addComment);
router.route("/:id").delete(deleteComment);
router.route("/:id/like").post(toggleCommentLike);

module.exports = router;
