const express = require("express");
const { register, login, logout, getCurrentUser, verifyAdmin, forgotPasswordQuiz, resetPasswordQuiz, changePassword } = require("../controllers/auth.controller");

const { protect } = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", protect, getCurrentUser);
router.post("/verify-admin", protect, verifyAdmin);
router.post("/forgot-password-quiz", forgotPasswordQuiz);
router.post("/reset-password-quiz", resetPasswordQuiz);
router.post("/change-password", protect, changePassword);



module.exports = router;
