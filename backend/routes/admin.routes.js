const express = require("express");
const { getAdminStats, getAllUsers, updateUserRole, getAllNotes, verifyNote, getSettings, updateSettings, deleteUser, updateUserDetails, createQuiz, getAllQuizzes, deleteQuiz, getAvailableModels } = require("../controllers/admin.controller");





const { protect, authorizeRoles } = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("admin"));

router.get("/stats", getAdminStats);
router.get("/users", getAllUsers);
router.patch("/users/:id/role", updateUserRole);
router.patch("/users/:id", updateUserDetails);
router.delete("/users/:id", deleteUser);
router.get("/notes", getAllNotes);

router.patch("/notes/:id/verify", verifyNote);
router.get("/settings", getSettings);
router.patch("/settings", updateSettings);
router.get("/quizzes", getAllQuizzes);
router.post("/quizzes", createQuiz);
router.delete("/quizzes/:id", deleteQuiz);
router.get("/ai-models", getAvailableModels);





module.exports = router;


