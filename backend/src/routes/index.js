const express = require("express");
const authRoutes = require("./auth.routes");
const noteRoutes = require("./note.routes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);

module.exports = router;
