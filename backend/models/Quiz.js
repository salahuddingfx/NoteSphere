const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: [v => v.length >= 2, "At least 2 options are required"]
  },
  answer: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: "security", // For password resets
  }
}, { timestamps: true });

module.exports = mongoose.model("Quiz", quizSchema);
