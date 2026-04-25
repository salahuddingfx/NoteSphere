const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 180,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ["Hand-written", "Digital", "Exam Paper", "Assignment", "Lab Report", "Other"],
      default: "Digital",
    },

    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
    },
    coverUrl: {
      type: String,
      trim: true,
    },

    publicId: {
      type: String,
      required: [true, "Cloudinary public ID is required"],
    },
    fileType: {
      type: String,
      enum: ["pdf", "image", "text"],
      required: [true, "File type is required"],
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
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    subjectCode: {
      type: String,
      trim: true,
      maxlength: 20,
    },
    teacher: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    tags: {
      type: [String],
      default: [],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
    downloads: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    attachments: [{
      url: { type: String, required: true },
      publicId: { type: String, required: true },
      fileType: { type: String, enum: ["pdf", "image", "text"], required: true }
    }],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    aiSummary: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

noteSchema.index({ title: "text", description: "text", subject: "text", subjectCode: "text", teacher: "text", tags: "text" });
noteSchema.index({ department: 1, semester: 1, subject: 1, subjectCode: 1, teacher: 1, fileType: 1, isVerified: 1 });
noteSchema.index({ downloads: -1, createdAt: -1 });

module.exports = mongoose.model("Note", noteSchema);
