const mongoose = require("mongoose");
const path = require("path");
const env = require("./config/env");
const User = require("./models/User");

async function promoteToAdmin() {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log("Connected to MongoDB");

    const result = await User.findOneAndUpdate(
      { username: "salahuddin" },
      { role: "admin" },
      { returnDocument: "after" }
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
