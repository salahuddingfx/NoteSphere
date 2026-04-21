const User = require("../models/User");
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

module.exports = {
  getLeaderboard,
  updateProfile,
  uploadAvatarPhoto,
};
