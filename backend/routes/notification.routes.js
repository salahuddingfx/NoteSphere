const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const {
  getNotifications,
  markAsRead,
  deleteNotification,
} = require("../controllers/notification.controller");

router.use(protect);

router.route("/").get(getNotifications);
router.route("/read").patch(markAsRead);
router.route("/:id").delete(deleteNotification);

module.exports = router;
