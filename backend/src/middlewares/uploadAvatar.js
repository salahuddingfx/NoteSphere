const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "notesphere/avatars",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
    transformation: [{ width: 400, height: 400, crop: "fill" }],
  },
});

const uploadAvatar = multer({ storage: storage });

module.exports = uploadAvatar;
