const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  platformName: {
    type: String,
    default: "NoteSphere",
  },
  maintenanceMode: {
    type: Boolean,
    default: false,
  },
  allowUploads: {
    type: Boolean,
    default: true,
  },
  aiFeatureEnabled: {
    type: Boolean,
    default: true,
  },
  contactEmail: {
    type: String,
    default: "admin@notesphere.app",
  },
  activeModel: {
    type: String,
    default: "google/gemini-2.0-flash-exp:free",
  }
}, { timestamps: true });

module.exports = mongoose.model("Setting", settingSchema);
