const mongoose = require("mongoose");
const dns = require("dns");
const env = require("./env");

// Set DNS servers to avoid querySrv ECONNREFUSED on some networks
try {
  dns.setServers(["8.8.8.8", "8.8.4.4"]);
} catch (e) {
  console.warn("Could not set DNS servers, using default.");
}

const connectDB = async () => {
  try {
    await mongoose.connect(env.mongodbUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("\x1b[32m[Database]\x1b[0m MongoDB connected successfully");
  } catch (error) {
    console.error("\x1b[31m[Database]\x1b[0m Connection failed:", error.message);
    if (error.message.includes("querySrv ECONNREFUSED")) {
      console.error("\x1b[33m[Tip]\x1b[0m This looks like a DNS issue. Try checking your internet connection or IP whitelist on MongoDB Atlas.");
    }
    throw error; // Let the caller handle exit
  }
};

module.exports = connectDB;
