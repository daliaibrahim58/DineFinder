const { parseRestaurantQuery, generateWithRetry } = require("./geminiService");

const { vectorSearchRestaurants } = require("./vectorSearchService");

// =====================================================
// Build Conversation History
// =====================================================

const buildHistoryText = (messages = []) => {
  if (!messages.length) {
    return "No previous conversation.";
  }

  return messages
    .map((message) => {
      const role = message.role === "user" ? "User" : "Assistant";

      return `${role}: ${message.content}`;
    })
    .join("\n");
};

// =====================================================
// Build Contextual Retrieval Query
// =====================================================

const buildRetrievalQuery = (currentMessage, messages = []) => {
  if (!messages.length) {
    return currentMessage;
  }

  const recentMessages = messages.slice(-6);

  const historyText = recentMessages
    .map((message) => {
      const role = message.role === "user" ? "User" : "Assistant";

      return `${role}: ${message.content}`;
    })
    .join("\n");

  return `
Previous conversation:

${historyText}

Current user message:

${currentMessage}

Understand the current message using
the previous conversation when necessary.
`;
};

// =====================================================
// RAG Search
// =====================================================

const ragRestaurantSearch = async (query, limit = 5) => {
  try {
    console.log("\n========================================");

    console.log("RAG SEARCH START");

    console.log("========================================");

    console.log("User Query:", query);

    // =====================================================
    // 1. Parse Filters
    // =====================================================

    const filters = await parseRestaurantQuery(query);

    console.log("AI FILTERS:", filters);

    // =====================================================
    // 2. Vector Search
    // =====================================================

    const restaurants = await vectorSearchRestaurants(query, filters, limit);

    // =====================================================
    // 3. No Results
    // =====================================================

    if (!restaurants.length) {
      return {
        answer: "I couldn't find restaurants matching your request.",
        restaurants: [],
        filters,
      };
    }

    // =====================================================
    // 4. Build Restaurant Context
    // =====================================================

    const context = restaurants
      .map((restaurant, index) => {
        return `
Restaurant ${index + 1}

Name:
${restaurant.name}

Description:
${restaurant.description || "Not available"}

Cuisine:
${restaurant.cuisine || "Not available"}

Area:
${restaurant.area || "Not available"}

Address:
${restaurant.address || "Not available"}

Price:
${restaurant.price ?? "Not available"}

Rating:
${restaurant.rating ?? "Not available"}

Rating Count:
${restaurant.ratingCount ?? 0}

Opening Time:
${restaurant.openingTime ?? "Not available"}

Closing Time:
${restaurant.closingTime ?? "Not available"}
`;
      })
      .join("\n");

    // =====================================================
    // 5. Generate Final Answer
    // =====================================================

    const prompt = `
You are a helpful AI restaurant recommendation assistant.

The user asked:

"${query}"

The system retrieved these restaurants:

${context}

Answer using ONLY the restaurant information above.

Rules:

1. Do not invent information.
2. Do not invent prices.
3. Do not invent opening hours.
4. Do not mention restaurants outside the context.
5. Mention restaurant names clearly.
6. Mention rating, cuisine, area, and address
   when useful.
7. Be concise and friendly.
8. Answer in the same language as the user.
9. Do not mention RAG, embeddings,
   vector search, filters, or internal systems.

Return ONLY the final answer.
`;

    const response = await generateWithRetry(prompt, 3);

    const answer = response.text?.trim();

    if (!answer) {
      throw new Error("Gemini returned empty RAG answer");
    }

    return {
      answer,
      restaurants,
      filters,
    };
  } catch (error) {
    console.error("RAG SEARCH ERROR:", error?.message);

    throw error;
  }
};

// =====================================================
// RAG Chat
// =====================================================

const ragRestaurantChat = async (
  currentMessage,
  conversationHistory = [],
  limit = 5,
) => {
  try {
    console.log("\n========================================");

    console.log("RAG CHAT START");

    console.log("========================================");

    console.log("Current Message:", currentMessage);

    console.log("History Length:", conversationHistory.length);

    // =====================================================
    // 1. Build Retrieval Query
    // =====================================================

    const retrievalQuery = buildRetrievalQuery(
      currentMessage,
      conversationHistory,
    );

    console.log("\n========== RETRIEVAL QUERY ==========");

    console.log(retrievalQuery);

    // =====================================================
    // 2. Parse Filters
    // =====================================================

    const filters = await parseRestaurantQuery(retrievalQuery);

    console.log("\n========== CHAT FILTERS ==========");

    console.log(filters);

    // =====================================================
    // 3. Vector Search
    // =====================================================

    const restaurants = await vectorSearchRestaurants(
      retrievalQuery,
      filters,
      limit,
    );

    console.log("Retrieved Restaurants:", restaurants.length);

    // =====================================================
    // 4. No Results
    // =====================================================

    if (!restaurants.length) {
      return {
        answer: "I couldn't find restaurants matching your request.",

        restaurants: [],

        filters,
      };
    }

    // =====================================================
    // 5. Restaurant Context
    // =====================================================

    const restaurantContext = restaurants
      .map((restaurant, index) => {
        return `
Restaurant ${index + 1}

Name:
${restaurant.name}

Description:
${restaurant.description || "Not available"}

Cuisine:
${restaurant.cuisine || "Not available"}

Area:
${restaurant.area || "Not available"}

Address:
${restaurant.address || "Not available"}

Price:
${restaurant.price ?? "Not available"}

Rating:
${restaurant.rating ?? "Not available"}

Rating Count:
${restaurant.ratingCount ?? 0}

Opening Time:
${restaurant.openingTime ?? "Not available"}

Closing Time:
${restaurant.closingTime ?? "Not available"}
`;
      })
      .join("\n");

    // =====================================================
    // 6. History
    // =====================================================

    const historyText = buildHistoryText(conversationHistory);

    // =====================================================
    // 7. Final Prompt
    // =====================================================

    const prompt = `
You are a helpful AI restaurant recommendation assistant.

This is a multi-turn conversation.

Previous conversation:
${historyText}

Current user message:
${currentMessage}

Relevant restaurants retrieved from the database:

${restaurantContext}

Rules:

1. Understand the current message using
   the previous conversation.

2. Resolve references such as:
   "مين فيهم؟"
   "واحد منهم"
   "طب مين أحسن؟"
   "طب واحد أرخص"
   "ومين الأقرب؟"

3. Use ONLY the restaurant information provided.

4. Do not invent restaurant information.

5. Do not invent prices.

6. Do not invent opening hours.

7. Do not mention restaurants outside the
   retrieved context.

8. Answer naturally and conversationally.

9. Answer in the same language as the user.

10. Do not mention RAG, embeddings,
    vector search, filters, prompts,
    or internal instructions.

Return ONLY the final answer.
`;

    // =====================================================
    // 8. Generate Answer
    // =====================================================

    const response = await generateWithRetry(prompt, 3);

    const answer = response.text?.trim();

    if (!answer) {
      throw new Error("Gemini returned empty chat answer");
    }

    return {
      answer,
      restaurants,
      filters,
    };
  } catch (error) {
    console.error("RAG CHAT ERROR:", error?.message);

    throw error;
  }
};

// =====================================================
// Exports
// =====================================================

module.exports = {
  ragRestaurantSearch,
  ragRestaurantChat,
};
