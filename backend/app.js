const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const env = require("./config/env");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NoteSphere API is healthy",
  });
});

app.use("/api/v1", routes);
app.use(errorHandler);

module.exports = app;
