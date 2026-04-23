const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["student", "moderator", "admin"],
      default: "student",
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    monthlyXp: {
      type: Number,
      default: 0,
      min: 0,
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    badges: {
      type: [String],
      default: [],
    },
    avatar: {
      type: String,
      default: function() {
        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${this.username || 'Felix'}`;
      },
    },
    bio: {
      type: String,
      default: "",
      maxlength: 250,
    },
    socials: {
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      contact: { type: String, default: "" },
    },
    savedNotes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Note",
    }],
    lastLogin: {
      type: Date,
      default: null,
    },
    isProfileCompleted: {
      type: Boolean,
      default: false,
    },
    streakCount: {
      type: Number,
      default: 0,
    },
    lastActiveDate: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password")) {
    return;
  }

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function comparePassword(plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
