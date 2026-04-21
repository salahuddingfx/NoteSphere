const express = require("express");
const { getLeaderboard } = require("../controllers/user.controller");

const router = express.Router();

router.get("/leaderboard", getLeaderboard);

module.exports = router;
