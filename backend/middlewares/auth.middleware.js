const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const { verifyToken } = require("../utils/jwt");

const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      throw new ApiError(401, "Not authorized. Please log in.");
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      throw new ApiError(401, "User no longer exists.");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, "You do not have permission to perform this action."));
  }

  return next();
};

module.exports = {
  protect,
  authorizeRoles,
};
