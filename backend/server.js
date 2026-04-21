const app = require("./app");
const connectDB = require("./config/db");
const env = require("./config/env");

const BANNER = `
\x1b[38;5;99m   _  __     __      _____       __                    
\x1b[38;5;105m  / |/ /__  / /____ / ___/____  / /  ___  _______      
\x1b[38;5;111m /    / _ \\/ __/ -_|__ \\/ __/ _ \\/ _ \\/ _ \\/ __/ -_)     
\x1b[38;5;117m/_/|_/\\___/\\__/\\__/____/\\__/\\___/_//_/\\___/_/  \\__/      
\x1b[38;5;123m                                                         
\x1b[38;5;129m        >> THE UNIVERSAL ACADEMIC VAULT <<              
\x1b[0m`;

const startServer = async () => {
  try {
    console.log(BANNER);
    console.log("\x1b[34m[System]\x1b[0m Initializing Nexus Core...");
    
    await connectDB();
    console.log("\x1b[32m[Database]\x1b[0m Matrix Connection Established.");

    const server = app.listen(env.port, () => {
      console.log("\x1b[35m[Network]\x1b[0m Signal active on port \x1b[1m" + env.port + "\x1b[0m");
      console.log("\x1b[36m[Status]\x1b[0m NoteSphere V1.0 - Live & Operational");
      console.log("\x1b[90m------------------------------------------------\x1b[0m");
    });

    server.on("error", (error) => {
      if (error.code === "EADDRINUSE") {
        console.error(`\x1b[31m[Error]\x1b[0m Port ${env.port} is already in use.`);
      } else {
        console.error("\x1b[31m[Error]\x1b[0m Server error:", error.message);
      }
      process.exit(1);
    });

  } catch (error) {
    console.error("\x1b[31m[Critical]\x1b[0m Failed to start server:", error.message);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason, promise) => {
  console.error("\x1b[31m[Fatal]\x1b[0m Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error("\x1b[31m[Fatal]\x1b[0m Uncaught Exception:", error.stack || error.message);
  process.exit(1);
});

startServer();
