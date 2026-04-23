const Discussion = require("../models/Discussion");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const User = require("../models/User");

const createDiscussion = asyncHandler(async (req, res) => {
  const { title, content, subject } = req.body;

  if (!title || !content || !subject) {
    throw new ApiError(400, "Missing required fields for discussion.");
  }

  const discussion = await Discussion.create({
    title,
    content,
    subject,
    author: req.user._id,
  });

  // Award XP for starting a discussion
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { xp: 50, monthlyXp: 50 }
  });

  res.status(201).json({ success: true, discussion });
});

const getDiscussionsBySubject = asyncHandler(async (req, res) => {
  const { subject } = req.params;
  const discussions = await Discussion.find({ subject })
    .populate("author", "name username avatar xp level")
    .populate("replies.author", "name username avatar")
    .sort({ isPinned: -1, createdAt: -1 });

  res.status(200).json({ success: true, discussions });
});

const addReply = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const discussion = await Discussion.findById(req.params.id);

  if (!discussion) {
    throw new ApiError(404, "Discussion not found.");
  }

  discussion.replies.push({
    author: req.user._id,
    content,
  });

  await discussion.save();

  // Award XP for contributing to a discussion
  await User.findByIdAndUpdate(req.user._id, {
    $inc: { xp: 20, monthlyXp: 20 }
  });

  res.status(200).json({ success: true, discussion });
});

const toggleLike = asyncHandler(async (req, res) => {
  const discussion = await Discussion.findById(req.params.id);
  if (!discussion) throw new ApiError(404, "Discussion not found.");

  const userId = req.user._id.toString();
  const index = discussion.likes.indexOf(userId);

  if (index === -1) {
    discussion.likes.push(userId);
  } else {
    discussion.likes.splice(index, 1);
  }

  await discussion.save();
  res.status(200).json({ success: true, liked: index === -1 });
});

module.exports = {
  createDiscussion,
  getDiscussionsBySubject,
  addReply,
  toggleLike,
};
