const express = require("express");
const { register, login, logout, getCurrentUser, verifyAdmin } = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);
router.post("/verify-admin", protect, verifyAdmin);

module.exports = router;
