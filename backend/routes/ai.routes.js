const express = require("express");
const router = express.Router();
const aiController = require("../controllers/ai.controller");
const { protect } = require("../middlewares/auth.middleware");


router.post("/chat", protect, aiController.chatWithAI);
router.post("/learning-path", protect, aiController.generateLearningPath);
router.post("/quiz", protect, aiController.generateQuiz);
router.post("/flashcards", protect, aiController.generateFlashcards);



module.exports = router;
