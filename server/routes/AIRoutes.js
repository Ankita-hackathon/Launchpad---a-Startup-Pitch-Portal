const express = require("express");
const router = express.Router();
const { ChatWithAI } = require("../middleware/ChatBotMiddleware");

router.post("/chat", ChatWithAI);

module.exports = router;
