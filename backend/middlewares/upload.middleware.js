const multer = require("multer");
const ApiError = require("../utils/ApiError");

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "application/pdf", 
    "image/jpeg", 
    "image/png", 
    "image/webp",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    cb(new ApiError(400, "Only PDF, JPEG, PNG, WEBP, and DOC files are allowed"));
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter,
});


module.exports = upload;
