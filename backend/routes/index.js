const express = require("express");
const authRoutes = require("./auth.routes");
const noteRoutes = require("./note.routes");
const userRoutes = require("./user.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);
router.use("/users", userRoutes);

module.exports = router;
