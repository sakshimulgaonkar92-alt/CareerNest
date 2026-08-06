const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { sendMessage, getMessages } = require("../controllers/messageController");

router.post("/", protect, sendMessage);
router.get("/:applicationId", protect, getMessages);

module.exports = router;
