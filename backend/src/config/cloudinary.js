const cloudinary = require("cloudinary").v2;
const env = require("./env");

const isCloudinaryConfigured = Boolean(env.cloudinaryName && env.cloudinaryKey && env.cloudinarySecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: env.cloudinaryName,
    api_key: env.cloudinaryKey,
    api_secret: env.cloudinarySecret,
  });
}

module.exports = {
  cloudinary,
  isCloudinaryConfigured,
};
