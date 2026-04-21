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
    fileUrl: {
      type: String,
      required: [true, "File URL is required"],
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
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

noteSchema.index({ title: "text", description: "text", subject: "text", subjectCode: "text", teacher: "text", tags: "text" });
noteSchema.index({ department: 1, semester: 1, subject: 1, subjectCode: 1, teacher: 1, fileType: 1, isVerified: 1 });
noteSchema.index({ downloads: -1, createdAt: -1 });

module.exports = mongoose.model("Note", noteSchema);
