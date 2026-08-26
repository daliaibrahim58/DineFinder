const express = require("express");

const {
  ragSearch,
  ragChat,
  getMyConversations,
  getMyConversation,
  deleteChat,
} = require("../controllers/aiController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// =====================================================
// RAG Search
// =====================================================

router.post("/rag", ragSearch);

// =====================================================
// RAG Chat
// =====================================================

router.post("/chat", protect, ragChat);

// =====================================================
// Get User Conversations
// =====================================================

router.get("/chat", protect, getMyConversations);

// =====================================================
// Get Specific Conversation
// =====================================================

router.get("/chat/:conversationId", protect, getMyConversation);

// =====================================================
// Delete Conversation
// =====================================================

router.delete("/chat/:conversationId", protect, deleteChat);

module.exports = router;
