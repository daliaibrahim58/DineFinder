const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const EMBEDDING_MODEL = "gemini-embedding-001";

// =====================================================
// Generate Restaurant Embedding
// Used when creating/storing restaurant embeddings
// =====================================================

const generateRestaurantEmbedding = async (text) => {
  try {
    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,

      contents: text,

      config: {
        taskType: "RETRIEVAL_DOCUMENT",
        outputDimensionality: 768,
      },
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding) {
      throw new Error("Gemini returned empty restaurant embedding");
    }

    return embedding;
  } catch (error) {
    console.error("Restaurant Embedding Error:", error?.message);

    throw error;
  }
};

// =====================================================
// Generate Query Embedding
// Used when searching
// =====================================================

const generateQueryEmbedding = async (text) => {
  try {
    const response = await ai.models.embedContent({
      model: EMBEDDING_MODEL,

      contents: text,

      config: {
        taskType: "RETRIEVAL_QUERY",
        outputDimensionality: 768,
      },
    });

    const embedding = response.embeddings?.[0]?.values;

    if (!embedding) {
      throw new Error("Gemini returned empty query embedding");
    }

    return embedding;
  } catch (error) {
    console.error("Query Embedding Error:", error?.message);

    throw error;
  }
};

module.exports = {
  generateRestaurantEmbedding,
  generateQueryEmbedding,
};
