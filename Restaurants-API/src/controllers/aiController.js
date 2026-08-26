const {
  ragRestaurantSearch,
  ragRestaurantChat,
} = require("../services/ragService");

const {
  getOrCreateConversation,
  addMessage,
  getRecentMessages,
  deleteConversation,
  getUserConversations,
  getConversationById,
} = require("../services/conversationService");

// =====================================================
// RAG Search
// =====================================================

const ragSearch = async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;

    if (!query || typeof query !== "string" || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: "Query is required",
      });
    }

    const result = await ragRestaurantSearch(query.trim(), Number(limit));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("RAG SEARCH CONTROLLER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "RAG search failed",
      error: error?.message || "Unknown error",
    });
  }
};

// =====================================================
// RAG Chat
// =====================================================

const ragChat = async (req, res) => {
  try {
    const { conversationId, message, limit = 5 } = req.body;

    // =====================================================
    // Validate Message
    // =====================================================

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // =====================================================
    // Current User
    // =====================================================

    const userId = req.user?._id || req.user?.id || null;

    // =====================================================
    // Get / Create Conversation
    // =====================================================

    const conversation = await getOrCreateConversation(
      conversationId || null,
      userId,
    );

    // =====================================================
    // Get Previous Messages
    // =====================================================

    const history = getRecentMessages(conversation, 10);

    // =====================================================
    // RAG Chat
    // =====================================================

    const result = await ragRestaurantChat(
      message.trim(),
      history,
      Number(limit),
    );

    // =====================================================
    // Save User Message
    // =====================================================

    await addMessage(conversation._id, "user", message.trim());

    // =====================================================
    // Save Assistant Message
    // =====================================================

    await addMessage(conversation._id, "assistant", result.answer);

    // =====================================================
    // Response
    // =====================================================

    return res.status(200).json({
      success: true,

      data: {
        conversationId: conversation._id,

        answer: result.answer,

        restaurants: result.restaurants,

        filters: result.filters,
      },
    });
  } catch (error) {
    console.error("RAG CHAT CONTROLLER ERROR:", error);

    if (error.message === "Conversation not found") {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    if (error.message === "You are not allowed to access this conversation") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this conversation",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Chat failed",
      error: error?.message || "Unknown error",
    });
  }
};

// =====================================================
// Get My Conversations
// =====================================================

const getMyConversations = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const conversations = await getUserConversations(userId);

    return res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    console.error("GET CONVERSATIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get conversations",
      error: error?.message || "Unknown error",
    });
  }
};

// =====================================================
// Get One Conversation
// =====================================================

const getMyConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const userId = req.user?._id || req.user?.id;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const conversation = await getConversationById(conversationId, userId);

    return res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error("GET CONVERSATION ERROR:", error);

    if (error.message === "Conversation not found") {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to get conversation",
      error: error?.message || "Unknown error",
    });
  }
};

// =====================================================
// Delete Conversation
// =====================================================

const deleteChat = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: "Conversation ID is required",
      });
    }

    const userId = req.user?._id || req.user?.id || null;

    await deleteConversation(conversationId, userId);

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CONVERSATION ERROR:", error);

    if (error.message === "Conversation not found") {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete conversation",
      error: error?.message || "Unknown error",
    });
  }
};

// =====================================================
// Exports
// =====================================================

module.exports = {
  ragSearch,
  ragChat,
  getMyConversations,
  getMyConversation,
  deleteChat,
};
