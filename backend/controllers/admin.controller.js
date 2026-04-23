const User = require("../models/User");
const Note = require("../models/Note");
const Quiz = require("../models/Quiz");
const asyncHandler = require("../utils/asyncHandler");
const axios = require("axios");


const getAvailableModels = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get("https://openrouter.ai/api/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:3000",
        "X-Title": "NoteSphere"
      }
    });

    if (!response.data || !Array.isArray(response.data.data)) {
      throw new Error("Invalid response format from OpenRouter");
    }

    // Filter for free models
    const freeModels = response.data.data
      .filter(model => {
        // Some models might not have pricing info, or pricing might be represented differently
        if (!model.pricing) return false;
        
        const isFreePrompt = String(model.pricing.prompt) === "0" || parseFloat(model.pricing.prompt) === 0;
        const isFreeCompletion = String(model.pricing.completion) === "0" || parseFloat(model.pricing.completion) === 0;
        
        return isFreePrompt && isFreeCompletion;
      })
      .map(model => ({
        id: model.id,
        name: model.name,
        description: model.description || "No description available"
      }));

    res.status(200).json({ success: true, models: freeModels });
  } catch (err) {
    console.error("OpenRouter Fetch Error:", err.response?.data || err.message);
    res.status(500).json({ 
      success: false, 
      message: "Failed to sync with OpenRouter",
      error: err.response?.data?.error?.message || err.message
    });
  }
});

const createQuiz = asyncHandler(async (req, res) => {

  const quiz = await Quiz.create(req.body);
  res.status(201).json({ success: true, quiz });
});

const getAllQuizzes = asyncHandler(async (req, res) => {
  const quizzes = await Quiz.find().sort({ createdAt: -1 });
  res.status(200).json({ success: true, quizzes });
});

const deleteQuiz = asyncHandler(async (req, res) => {
  await Quiz.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "Quiz deleted" });
});

const getAdminStats = asyncHandler(async (req, res) => {

  const totalUsers = await User.countDocuments();
  const totalNotes = await Note.countDocuments();
  const verifiedNotes = await Note.countDocuments({ isVerified: true });
  
  // Popular Departments
  const deptStats = await Note.aggregate([
    { $group: { _id: "$department", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  // Top Contributors
  const topContributors = await User.find()
    .sort({ xp: -1 })
    .limit(5)
    .select("name username avatar xp level");

  res.status(200).json({
    success: true,
    stats: {
      totalUsers,
      totalNotes,
      verifiedNotes,
      deptStats,
      topContributors
    }
  });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  res.status(200).json({ success: true, users });
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { returnDocument: "after" }).select("-password");
  res.status(200).json({ success: true, user });
});

const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ success: true, message: "User purged from Nexus" });
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true }).select("-password");
  res.status(200).json({ success: true, user });
});


const getAllNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().populate("author", "name username").sort({ createdAt: -1 });
  res.status(200).json({ success: true, notes });
});

const verifyNote = asyncHandler(async (req, res) => {
  const { isVerified } = req.body;
  const note = await Note.findByIdAndUpdate(req.params.id, { isVerified }, { returnDocument: "after" });
  res.status(200).json({ success: true, note });
});

const Setting = require("../models/Setting");

const getSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({});
  }
  res.status(200).json({ success: true, settings });
});

const updateSettings = asyncHandler(async (req, res) => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create(req.body);
  } else {
    settings = await Setting.findOneAndUpdate({}, req.body, { returnDocument: "after" });
  }
  res.status(200).json({ success: true, settings });
});

module.exports = {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  getAllNotes,
  verifyNote,
  getSettings,
  updateSettings,
  deleteUser,
  updateUserDetails,
  createQuiz,
  getAllQuizzes,
  deleteQuiz,
  getAvailableModels
};






