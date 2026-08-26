const Conversation = require("../models/Conversation");

// =====================================================
// Get Or Create Conversation
// =====================================================

const getOrCreateConversation = async (conversationId, userId = null) => {
  // =====================================================
  // Existing Conversation
  // =====================================================

  if (conversationId) {
    const conversation = await Conversation.findById(conversationId);

    if (conversation) {
      // Optional security check
      if (
        userId &&
        conversation.userId &&
        conversation.userId.toString() !== userId.toString()
      ) {
        throw new Error("Unauthorized conversation access");
      }

      return conversation;
    }
  }

  // =====================================================
  // Create New Conversation
  // =====================================================

  const conversation = await Conversation.create({
    userId,
    messages: [],
  });

  return conversation;
};

// =====================================================
// Add Message
// =====================================================

const addMessage = async (conversationId, role, content) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  conversation.messages.push({
    role,
    content,
  });

  await conversation.save();

  return conversation;
};

// =====================================================
// Get Recent Messages
// =====================================================

const getRecentMessages = (conversation, limit = 10) => {
  return conversation.messages.slice(-limit).map((message) => ({
    role: message.role,

    content: message.content,
  }));
};

// =====================================================
// Get User Conversations
// =====================================================

const getUserConversations = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const conversations = await Conversation.find({
    userId,
  })
    .sort({
      updatedAt: -1,
    })
    .select("_id title messages createdAt updatedAt");

  return conversations.map((conversation) => ({
    _id: conversation._id,

    title: conversation.title || getConversationTitle(conversation),

    messageCount: conversation.messages.length,

    createdAt: conversation.createdAt,

    updatedAt: conversation.updatedAt,
  }));
};

// =====================================================
// Get Conversation By ID
// =====================================================

const getConversationById = async (conversationId, userId) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  return conversation;
};

// =====================================================
// Delete Conversation
// =====================================================

const deleteConversation = async (conversationId, userId) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  await conversation.deleteOne();

  return true;
};

// =====================================================
// Generate Conversation Title
// =====================================================

const getConversationTitle = (conversation) => {
  const firstUserMessage = conversation.messages.find(
    (message) => message.role === "user",
  );

  if (!firstUserMessage) {
    return "New Conversation";
  }

  const text = firstUserMessage.content.trim();

  if (text.length <= 40) {
    return text;
  }

  return `${text.slice(0, 40)}...`;
};

// =====================================================
// Exports
// =====================================================

module.exports = {
  getOrCreateConversation,

  addMessage,

  getRecentMessages,

  getUserConversations,

  getConversationById,

  deleteConversation,
};
