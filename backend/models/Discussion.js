const mongoose = require("mongoose");

const discussionSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
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
    replies: [{
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      content: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    }],
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Discussion", discussionSchema);
