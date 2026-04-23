const express = require("express");
const authRoutes = require("./auth.routes");
const noteRoutes = require("./note.routes");
const userRoutes = require("./user.routes");
const adminRoutes = require("./admin.routes");
const aiRoutes = require("./ai.routes");
const collectionRoutes = require("./collection.routes");
const commentRoutes = require("./comment.routes");
const notificationRoutes = require("./notification.routes");
const discussionRoutes = require("./discussion.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/ai", aiRoutes);
router.use("/collections", collectionRoutes);
router.use("/comments", commentRoutes);
router.use("/notifications", notificationRoutes);
router.use("/discussions", discussionRoutes);





module.exports = router;

