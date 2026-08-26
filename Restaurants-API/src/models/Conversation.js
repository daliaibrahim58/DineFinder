const mongoose = require("mongoose");

// =====================================================
// Message Schema
// =====================================================

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,

      enum: ["user", "assistant"],

      required: true,
    },

    content: {
      type: String,

      required: true,

      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// =====================================================
// Conversation Schema
// =====================================================

const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "User",

      default: null,
    },

    title: {
      type: String,

      trim: true,

      default: "New Conversation",
    },

    messages: {
      type: [messageSchema],

      default: [],
    },
  },
  {
    timestamps: true,
  },
);

// =====================================================
// Model
// =====================================================

const Conversation = mongoose.model("Conversation", conversationSchema);

module.exports = Conversation;
