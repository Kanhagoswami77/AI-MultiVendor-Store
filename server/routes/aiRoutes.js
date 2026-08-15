const express = require("express");

const {
  chatWithAI,
  shoppingChat,
} = require("../controllers/aiController");

const router = express.Router();

router.post("/chat", chatWithAI);

router.post("/shopping-chat", shoppingChat);

module.exports = router;