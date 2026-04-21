const User = require("../models/User");
const mongoose = require("mongoose");
const asyncHandler = require("../utils/asyncHandler");

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
  const { bio, socials, avatar } = req.body;

  let user = await User.findByIdAndUpdate(
    req.user.id,
    { bio, socials, avatar },
    { new: true, runValidators: true }
  );

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
    await user.save();
    bonusMessage = "🎯 Milestone Reached! +500 XP for Profile Completion.";
  }

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
    { new: true }
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
    groupBy = { $dateToString: { format: "%a", date: "$createdAt" } }; // Mon, Tue...
    dateRange.setDate(dateRange.getDate() - 7);
  } else if (view === "weekly") {
    groupBy = { $week: "$createdAt" };
    dateRange.setDate(dateRange.getDate() - 28);
  } else if (view === "monthly") {
    groupBy = { $dateToString: { format: "%b", date: "$createdAt" } }; // Jan, Feb...
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

  const formattedStats = stats.map(s => ({
    name: s._id.toString(),
    notes: s.count
  }));

  res.status(200).json({
    success: true,
    stats: formattedStats.length > 0 ? formattedStats : [{ name: "No Data", notes: 0 }],
  });
});

module.exports = {
  getLeaderboard,
  updateProfile,
  uploadAvatarPhoto,
  getContributionStats,
};
