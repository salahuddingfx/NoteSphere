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
  });

  const token = signToken({ id: user._id, role: user.role });
  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "Registration successful",
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

  const token = signToken({ id: user._id, role: user.role });
  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Login successful",
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

module.exports = {
  register,
  login,
  logout,
  getCurrentUser,
  verifyAdmin,
};
