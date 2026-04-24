const express = require("express");
const {
  createNote,
  getNotes,
  getNoteBySlug,
  updateNote,
  deleteNote,
  toggleLike,
  trackDownload,
  generateSummary,
} = require("../controllers/note.controller");
const { protect } = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");

const router = express.Router();

router.get("/", getNotes);
router.get("/:slug", getNoteBySlug);
router.post("/", protect, upload.fields([
  { name: "file", maxCount: 10 },
  { name: "cover", maxCount: 1 }
]), createNote);
router.patch("/:id", protect, updateNote);
router.delete("/:id", protect, deleteNote);
router.post("/:id/like", protect, toggleLike);
router.post("/:id/download", protect, trackDownload);
router.post("/:id/summary", protect, generateSummary);

module.exports = router;

