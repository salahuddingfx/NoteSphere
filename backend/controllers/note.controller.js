const slugify = require("slugify");
const Note = require("../models/Note");
const Notification = require("../models/Notification");

const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const { cloudinary, isCloudinaryConfigured } = require("../config/cloudinary");
const { openai, DEFAULT_MODEL } = require("../config/ai.config");



const toSlug = (value) =>
  slugify(value, {
    lower: true,
    strict: true,
    trim: true,
  });

const generateUniqueSlug = async (title) => {
  const baseSlug = toSlug(title);
  let finalSlug = baseSlug;
  let suffix = 1;

  while (await Note.findOne({ slug: finalSlug })) {
    finalSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return finalSlug;
};

const uploadToCloudinary = async (fileBuffer, fileType) => {
  if (!isCloudinaryConfigured) {
    throw new ApiError(500, "Cloudinary is not configured. Add Cloudinary environment variables.");
  }

  const dataUri = `data:${fileType};base64,${fileBuffer.toString("base64")}`;

  return cloudinary.uploader.upload(dataUri, {
    folder: "notesphere/notes",
    resource_type: "auto",
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    quality: "auto",
    fetch_format: "auto",
  });
};

const inferNoteFileType = (mimetype) => {
  if (mimetype === "application/pdf") return "pdf";
  if (["image/jpeg", "image/png", "image/webp"].includes(mimetype)) return "image";
  return "text";
};

const createNote = asyncHandler(async (req, res) => {
  const { title, description, department, semester, subject, subjectCode, teacher, category, tags } = req.body;

  if (!req.files || !req.files.file || req.files.file.length === 0) {
    throw new ApiError(400, "At least one note file is required");
  }

  if (!title || !description || !department || !semester || !subject) {
    throw new ApiError(400, "Missing required fields");
  }

  const noteFiles = req.files.file;
  const coverFiles = req.files.cover || [];

  // For now, we take the first file as the primary note asset
  // In the future, we could support multiple file uploads
  const mainFile = noteFiles[0];
  
  const slug = await generateUniqueSlug(title);
  
  // Upload main file to Cloudinary
  const uploadResult = await uploadToCloudinary(mainFile.buffer, mainFile.mimetype);
  
  // Upload cover image if provided
  let coverUrl = "";
  if (coverFiles.length > 0) {
    const coverUpload = await uploadToCloudinary(coverFiles[0].buffer, coverFiles[0].mimetype);
    coverUrl = coverUpload.secure_url;
  }

  const normalizedTags = Array.isArray(tags)
    ? tags
    : typeof tags === "string"
      ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
      : [];

  const note = await Note.create({
    title,
    slug,
    description,
    fileUrl: uploadResult.secure_url,
    coverUrl: coverUrl,
    publicId: uploadResult.public_id,
    fileType: inferNoteFileType(mainFile.mimetype),
    department,
    semester,
    subject,
    subjectCode,
    teacher,
    category: category || "Digital",
    tags: normalizedTags,
    author: req.user._id,
  });


  // Badge Awarding Logic
  const User = require("../models/User");
  const user = await User.findById(req.user._id);
  
  const subjectCount = await Note.countDocuments({ 
    author: user._id, 
    subject: subject 
  });

  let newBadge = null;
  const badgeMap = {
    "Mathematics": "Math Wizard",
    "Computer Science": "Code Ninja",
    "Electrical Engineering": "Circuit Master",
    "Physics": "Quantum Explorer",
    "Chemistry": "Alchemist"
  };

  const badgeName = badgeMap[subject];
  if (badgeName && subjectCount >= 5 && !user.badges.includes(badgeName)) {
    user.badges.push(badgeName);
    user.xp += 1000; // Large bonus for subject mastery
    user.level = Math.floor(user.xp / 500) + 1;
    await user.save();
    newBadge = badgeName;

    await Notification.create({
      recipient: user._id,
      sender: user._id, // System notifications can have same sender/recipient or a system user
      type: "badge",
      message: `Achievement Unlocked: ${badgeName}! +1000 XP granted.`
    });
  }


  res.status(201).json({
    success: true,
    message: newBadge ? `Mastery Achieved! Awarded: ${newBadge}` : "Note uploaded successfully",
    note,
    badge: newBadge
  });
});


const getNotes = asyncHandler(async (req, res) => {
  const { search, department, semester, subject, subjectCode, teacher, fileType, category, tag, verified, sort = "latest" } = req.query;

  const query = {};

  if (search) {
    query.$text = { $search: String(search) };
  }

  if (department) query.department = department;
  if (semester) query.semester = semester;
  if (category) query.category = category;

  if (subject) query.subject = subject;
  if (subjectCode) query.subjectCode = subjectCode;
  if (teacher) query.teacher = teacher;
  if (fileType) query.fileType = fileType;
  if (tag) query.tags = tag;
  if (typeof verified !== "undefined") query.isVerified = verified === "true";

  let sortBy = { createdAt: -1 };
  if (sort === "trending") sortBy = { downloads: -1, createdAt: -1 };
  if (sort === "verified") query.isVerified = true;

  const notes = await Note.find(query)
    .populate("author", "name username avatar department semester role")
    .sort(sortBy)
    .limit(40);


  res.status(200).json({
    success: true,
    count: notes.length,
    notes,
  });
});

const getNoteBySlug = asyncHandler(async (req, res) => {
  const note = await Note.findOneAndUpdate(
    { slug: req.params.slug },
    { $inc: { views: 1 } },
    { returnDocument: "after" }
  ).populate("author", "name username avatar department semester role");


  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  res.status(200).json({
    success: true,
    note,
  });
});

const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  const isOwner = note.author.toString() === req.user._id.toString();
  const isAdmin = ["admin", "moderator"].includes(req.user.role);

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You can only edit your own notes");
  }

  const { title, description, department, semester, subject, subjectCode, teacher, tags, isVerified } = req.body;

  if (title && title !== note.title) {
    note.title = title;
    note.slug = await generateUniqueSlug(title);
  }

  if (description) note.description = description;
  if (department) note.department = department;
  if (semester) note.semester = semester;
  if (subject) note.subject = subject;
  if (subjectCode) note.subjectCode = subjectCode;
  if (teacher) note.teacher = teacher;
  if (typeof tags !== "undefined") {
    note.tags = Array.isArray(tags)
      ? tags
      : String(tags)
          .split(",")
          .map((tagItem) => tagItem.trim())
          .filter(Boolean);
  }

  if (typeof isVerified !== "undefined" && isAdmin) {
    note.isVerified = String(isVerified) === "true";
  }

  await note.save();

  res.status(200).json({
    success: true,
    message: "Note updated successfully",
    note,
  });
});

const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  const isOwner = note.author.toString() === req.user._id.toString();
  const isAdmin = ["admin", "moderator"].includes(req.user.role);

  if (!isOwner && !isAdmin) {
    throw new ApiError(403, "You can only delete your own notes");
  }

  if (isCloudinaryConfigured && note.publicId) {
    await cloudinary.uploader.destroy(note.publicId, { resource_type: "raw" }).catch(() => {});
  }

  await note.deleteOne();

  res.status(200).json({
    success: true,
    message: "Note deleted successfully",
  });
});

const toggleLike = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  const userId = req.user._id.toString();
  const likedIndex = note.likes.findIndex((id) => id.toString() === userId);

  if (likedIndex >= 0) {
    note.likes.splice(likedIndex, 1);
  } else {
    note.likes.push(req.user._id);
  }

  await note.save();

  // Create Notification for Like
  if (likedIndex < 0 && note.author.toString() !== userId) {
    await Notification.create({
      recipient: note.author,
      sender: req.user._id,
      type: "like",
      note: note._id,
      message: `${req.user.name} appreciated your asset: ${note.title}`
    });
  }

  res.status(200).json({
    success: true,
    liked: likedIndex < 0,
    likesCount: note.likes.length,
  });
});


const trackDownload = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  note.downloads += 1;
  await note.save();

  res.status(200).json({
    success: true,
    downloads: note.downloads,
    fileUrl: note.fileUrl,
  });
});

const generateSummary = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  if (note.aiSummary) {
    return res.status(200).json({
      success: true,
      summary: note.aiSummary,
    });
  }

  const prompt = `Summarize this academic note in 3-4 concise bullet points. 
  Title: ${note.title}
  Subject: ${note.subject}
  Description: ${note.description}
  Tags: ${note.tags.join(", ")}
  
  Focus on key learning outcomes and main concepts. Keep it professional and student-friendly.`;

  try {
    const Setting = require("../models/Setting");
    const settings = await Setting.findOne();
    const modelToUse = settings?.activeModel || DEFAULT_MODEL;

    const response = await openai.chat.completions.create({
      model: modelToUse,
      messages: [
        {
          role: "system",
          content: "You are an expert academic summarizer. Provide concise, helpful summaries in 3-4 bullet points."
        },
        {
          role: "user",
          content: prompt
        }
      ],
    });


    const summary = response.choices[0].message.content;

    note.aiSummary = summary;
    await note.save();

    res.status(200).json({
      success: true,
      summary,
    });
  } catch (error) {
    console.error("OpenRouter Error:", error);
    throw new ApiError(500, "Failed to generate AI summary via OpenRouter");
  }
});


module.exports = {
  createNote,
  getNotes,
  getNoteBySlug,
  updateNote,
  deleteNote,
  toggleLike,
  trackDownload,
  generateSummary,
};

