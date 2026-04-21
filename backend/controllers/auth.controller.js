const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { signToken } = require("../utils/jwt");

const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  sameSite: isProd ? "none" : "lax",
  secure: isProd,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  username: user.username,
  department: user.department,
  semester: user.semester,
  role: user.role,
  xp: user.xp,
  level: user.level,
  badges: user.badges,
  avatar: user.avatar,
  streakCount: user.streakCount || 0,
});

const register = asyncHandler(async (req, res) => {
  console.log("[Auth] Registration attempt:", req.body);
  const { name, email, username, password, department, semester } = req.body;

  if (!name || !email || !username || !password || !department || !semester) {
    throw new ApiError(400, "All fields are required");
  }

  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    throw new ApiError(409, "Email is already in use");
  }

  const existingUsername = await User.findOne({ username });
  if (existingUsername) {
    throw new ApiError(409, "Username is already taken");
  }

  const user = await User.create({
    name,
    email,
    username,
    password,
    department,
    semester,
    xp: 100, // Account Opening Bonus
    level: 1,
    streakCount: 1,
    lastLogin: new Date(),
    lastActiveDate: new Date(),
  });

  const token = signToken({ id: user._id, role: user.role });
  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "Welcome to NoteSphere! +100 XP awarded. Streak started!",
    user: sanitizeUser(user),
  });
});

const login = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    throw new ApiError(400, "Identifier and password are required");
  }

  const user = await User.findOne({
    $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
  }).select("+password");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials");
  }

  // Daily Login Bonus & Streak Logic
  const now = new Date();
  const today = new Date(now).setHours(0, 0, 0, 0);
  const lastLogin = user.lastLogin ? new Date(user.lastLogin).setHours(0, 0, 0, 0) : null;
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayTime = yesterday.getTime();

  let message = "Login successful";
  if (!lastLogin || lastLogin < today) {
    user.xp += 50;
    
    // Streak logic
    if (lastLogin === yesterdayTime) {
      user.streakCount = (user.streakCount || 0) + 1;
    } else {
      user.streakCount = 1;
    }
    
    user.lastLogin = now;
    user.lastActiveDate = now;
    message = `Daily Login Reward! +50 XP awarded. Streak: ${user.streakCount} days!`;
  }

  // Auto-leveling logic: 1 Level per 500 XP
  user.level = Math.floor(user.xp / 500) + 1;
  await user.save();

  const token = signToken({ id: user._id, role: user.role });
  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message,
    user: sanitizeUser(user),
  });
});


const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions);

  res.status(200).json({
    success: true,
    message: "Logout successful",
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  
  res.status(200).json({
    success: true,
    user: sanitizeUser(req.user),
  });
});

const verifyAdmin = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new ApiError(400, "Password is required");
  }

  const user = await User.findById(req.user.id).select("+password");
  if (user.role !== "admin") {
    throw new ApiError(403, "Access denied. Admins only.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid password");
  }

  res.status(200).json({
    success: true,
    message: "Admin verified successfully",
  });
});

const Quiz = require("../models/Quiz");

const forgotPasswordQuiz = asyncHandler(async (req, res) => {
  const { identifier } = req.body;
  const user = await User.findOne({ $or: [{ email: identifier }, { username: identifier }] });
  
  if (!user) {
    throw new ApiError(404, "User not found in Nexus");
  }

  // Fetch 3 random quizzes from the database
  const quizzes = await Quiz.aggregate([{ $sample: { size: 3 } }]);
  
  // If no quizzes in DB, use fallbacks
  const quizPool = quizzes.length >= 3 ? quizzes : [
    { _id: "q1", question: "What is the result of 2^10?", options: ["512", "1024", "2048", "1000"], answer: "1024" },
    { _id: "q2", question: "Which layer of OSI model handles routing?", options: ["Physical", "Data Link", "Network", "Transport"], answer: "Network" },
    { _id: "q3", question: "What does HTML stand for?", options: ["High Text Markup Language", "Hyper Text Markup Language", "Hyper Tabular Machine Language", "None"], answer: "Hyper Text Markup Language" }
  ];

  res.status(200).json({
    success: true,
    message: "Security Quiz Generated. Complete to reset password.",
    quiz: quizPool.map(q => ({ id: q._id, question: q.question, options: q.options })),
    userId: user._id
  });
});

const resetPasswordQuiz = asyncHandler(async (req, res) => {
  const { userId, answers, newPassword } = req.body;

  let allCorrect = true;
  
  // Verify each answer against the DB
  for (const quizId of Object.keys(answers)) {
    // If it's a fallback ID
    if (quizId.startsWith("q")) {
       const fallbacks = {
         q1: "1024",
         q2: "Network",
         q3: "Hyper Text Markup Language"
       };
       if (answers[quizId] !== fallbacks[quizId]) allCorrect = false;
    } else {
       const quiz = await Quiz.findById(quizId);
       if (!quiz || quiz.answer !== answers[quizId]) allCorrect = false;
    }
  }

  if (!allCorrect) {
    throw new ApiError(400, "Security Quiz failed. Access denied.");
  }

  const user = await User.findById(userId);

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Nexus Identity Verified. Password reset successfully."
  });
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Current and new passwords are required");
  }

  const user = await User.findById(req.user.id).select("+password");
  
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(401, "Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully in the Nexus"
  });
});

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  verifyAdmin,
  forgotPasswordQuiz,
  resetPasswordQuiz,
  changePassword
};


