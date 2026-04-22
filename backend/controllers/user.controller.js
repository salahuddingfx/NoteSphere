const User = require("../models/User");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const getLeaderboard = asyncHandler(async (req, res) => {
  const users = await User.find()
    .sort({ xp: -1 })
    .limit(10)
    .select("name username avatar xp level badges");

  res.status(200).json({
    success: true,
    users,
  });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { name, username, email, password, bio, socials, avatar, department } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, "User not found");

  if (name) user.name = name;
  if (username) user.username = username;
  if (email) user.email = email;
  if (password) user.password = password;
  if (bio) user.bio = bio;
  if (avatar) user.avatar = avatar;
  if (department) user.department = department;
  if (socials) user.socials = { ...user.socials, ...socials };

  let bonusMessage = "";

  // Profile Completion Bonus Logic (+500 XP)
  const isNowComplete = 
    user.bio && 
    user.socials.instagram && 
    user.socials.facebook && 
    user.socials.linkedin && 
    user.socials.whatsapp && 
    user.socials.contact;

  if (isNowComplete && !user.isProfileCompleted) {
    user.xp += 500;
    user.isProfileCompleted = true;
    user.level = Math.floor(user.xp / 500) + 1;
    bonusMessage = "🎯 Milestone Reached! +500 XP for Profile Completion.";
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: bonusMessage || "Profile updated successfully",
    user,
  });
});


const uploadAvatarPhoto = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "Please upload an image file");
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatar: req.file.path },
    { returnDocument: "after" }
  );

  res.status(200).json({
    success: true,
    message: "Avatar synchronized with Nexus Vault",
    user,
  });
});

const Note = require("../models/Note");

const getContributionStats = asyncHandler(async (req, res) => {
  const { view = "daily" } = req.query;
  const userId = req.user.id;

  let groupBy;
  let dateRange = new Date();

  if (view === "daily") {
    groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    dateRange.setDate(dateRange.getDate() - 7);
  } else if (view === "weekly") {
    groupBy = { $week: "$createdAt" };
    dateRange.setDate(dateRange.getDate() - 28);
  } else if (view === "monthly") {
    groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
    dateRange.setMonth(dateRange.getMonth() - 6);
  } else {
    groupBy = { $dateToString: { format: "%Y", date: "$createdAt" } };
    dateRange.setFullYear(dateRange.getFullYear() - 1);
  }

  const stats = await Note.aggregate([
    {
      $match: {
        author: new mongoose.Types.ObjectId(userId),
        createdAt: { $gte: dateRange },
      },
    },
    {
      $group: {
        _id: groupBy,
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id": 1 } },
  ]);

  const formattedStats = stats.map(s => {
    let name = String(s._id || "N/A");
    
    if (view === "daily") {
      const date = new Date(s._id);
      name = date.toLocaleDateString("en-US", { weekday: "short" });
    } else if (view === "monthly") {
      const [year, month] = s._id.split("-");
      const date = new Date(year, month - 1);
      name = date.toLocaleDateString("en-US", { month: "short" });
    }
    
    return {
      name,
      notes: s.count || 0
    };
  });

  res.status(200).json({
    success: true,
    stats: formattedStats.length > 0 ? formattedStats : [{ name: "No Data", notes: 0 }],
  });
});

const getMyNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find({ author: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, notes });
});

const toggleSaveNote = asyncHandler(async (req, res) => {
  const { noteId } = req.body;
  const user = await User.findById(req.user.id);
  
  if (!user) throw new ApiError(404, "User not found");

  const noteIndex = user.savedNotes.indexOf(noteId);
  if (noteIndex > -1) {
    user.savedNotes.splice(noteIndex, 1);
  } else {
    user.savedNotes.push(noteId);
  }

  await user.save();

  res.status(200).json({
    success: true,
    saved: noteIndex === -1,
    savedNotes: user.savedNotes,
  });
});

const getSavedNotes = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: "savedNotes",
    populate: { path: "author", select: "name avatar department semester" }
  });
  
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json({
    success: true,
    notes: user.savedNotes,
  });
});

module.exports = {
  getLeaderboard,
  updateProfile,
  uploadAvatarPhoto,
  getContributionStats,
  getMyNotes,
  toggleSaveNote,
  getSavedNotes
};

