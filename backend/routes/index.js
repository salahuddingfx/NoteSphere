const express = require("express");
const authRoutes = require("./auth.routes");
const noteRoutes = require("./note.routes");
const userRoutes = require("./user.routes");
const adminRoutes = require("./admin.routes");
const aiRoutes = require("./ai.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);
router.use("/users", userRoutes);
router.use("/admin", adminRoutes);
router.use("/ai", aiRoutes);


module.exports = router;

