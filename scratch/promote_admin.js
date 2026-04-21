const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") });

const User = require("../backend/src/models/User");

async function promoteToAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    const result = await User.findOneAndUpdate(
      { username: "salahuddin" },
      { role: "admin" },
      { new: true }
    );

    if (result) {
      console.log(`Successfully promoted ${result.username} to ADMIN`);
    } else {
      console.log("User 'salahuddin' not found");
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error("Error:", error);
  }
}

promoteToAdmin();
