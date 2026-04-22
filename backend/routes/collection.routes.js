const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth.middleware");
const {
  createCollection,
  getMyCollections,
  addNoteToCollection,
  removeNoteFromCollection,
  deleteCollection,
} = require("../controllers/collection.controller");

router.use(protect);

router.route("/").get(getMyCollections).post(createCollection);
router.route("/add").post(addNoteToCollection);
router.route("/:collectionId/notes/:noteId").delete(removeNoteFromCollection);
router.route("/:id").delete(deleteCollection);

module.exports = router;
