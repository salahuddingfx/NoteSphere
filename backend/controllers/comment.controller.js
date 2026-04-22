const Comment = require("../models/Comment");
const Note = require("../models/Note");
const Notification = require("../models/Notification");


exports.addComment = async (req, res) => {
  try {
    const { noteId, content, parentCommentId } = req.body;
    
    const note = await Note.findById(noteId);
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });

    const comment = await Comment.create({
      content,
      author: req.user.id,
      note: noteId,
      parentComment: parentCommentId || null,
    });

    // Create Notification
    if (note.author.toString() !== req.user.id) {
      await Notification.create({
        recipient: note.author,
        sender: req.user.id,
        type: "comment",
        note: noteId,
        comment: comment._id,
        message: `${req.user.name} commented on your asset: ${note.title}`
      });
    }

    // If it's a reply, notify the parent comment author too
    if (parentCommentId) {
      const parentComment = await Comment.findById(parentCommentId);
      if (parentComment && parentComment.author.toString() !== req.user.id && parentComment.author.toString() !== note.author.toString()) {
        await Notification.create({
          recipient: parentComment.author,
          sender: req.user.id,
          type: "comment",
          note: noteId,
          comment: comment._id,
          message: `${req.user.name} replied to your thought in: ${note.title}`
        });
      }
    }

    const populatedComment = await comment.populate("author", "name username avatar");

    res.status(201).json({ success: true, comment: populatedComment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


exports.getNoteComments = async (req, res) => {
  try {
    const comments = await Comment.find({ note: req.params.noteId })
      .populate("author", "name username avatar")
      .sort({ createdAt: -1 });

    
    // Group comments and replies (simple version)
    const mainComments = comments.filter(c => !c.parentComment);
    const replies = comments.filter(c => c.parentComment);

    res.status(200).json({ success: true, comments: mainComments, replies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.id, author: req.user.id });
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found or unauthorized" });
    
    await Comment.deleteMany({ parentComment: comment._id }); // Delete replies
    await comment.deleteOne();

    res.status(200).json({ success: true, message: "Comment removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.toggleCommentLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ success: false, message: "Comment not found" });

    const isLiked = comment.likes.includes(req.user.id);
    if (isLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
    } else {
      comment.likes.push(req.user.id);
    }

    await comment.save();
    res.status(200).json({ success: true, liked: !isLiked });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
