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

module.exports = {
  getLeaderboard,
};
