const Restaurant = require("../models/Restaurant");

const { generateQueryEmbedding } = require("./embeddingService");

// =====================================================
// Build MongoDB Vector Filters
// =====================================================

const buildVectorFilter = (filters = {}) => {
  const conditions = [];

  // =====================================================
  // Cuisine
  // =====================================================

  if (filters.cuisine) {
    conditions.push({
      cuisine: {
        $eq: filters.cuisine,
      },
    });
  }

  // =====================================================
  // Area
  // =====================================================

  if (filters.area) {
    conditions.push({
      area: {
        $eq: filters.area,
      },
    });
  }

  // =====================================================
  // Min Price
  // =====================================================

  if (filters.minPrice !== null && filters.minPrice !== undefined) {
    conditions.push({
      price: {
        $gte: Number(filters.minPrice),
      },
    });
  }

  // =====================================================
  // Max Price
  // =====================================================

  if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
    conditions.push({
      price: {
        $lte: Number(filters.maxPrice),
      },
    });
  }

  // =====================================================
  // Min Rating
  // =====================================================

  if (filters.minRating !== null && filters.minRating !== undefined) {
    conditions.push({
      rating: {
        $gte: Number(filters.minRating),
      },
    });
  }

  // =====================================================
  // No Filters
  // =====================================================

  if (conditions.length === 0) {
    return undefined;
  }

  // =====================================================
  // One Filter
  // =====================================================

  if (conditions.length === 1) {
    return conditions[0];
  }

  // =====================================================
  // Multiple Filters
  // =====================================================

  return {
    $and: conditions,
  };
};

// =====================================================
// Vector Search Restaurants
// =====================================================

const vectorSearchRestaurants = async (query, filters = {}, limit = 10) => {
  try {
    console.log("\n========================================");

    console.log("VECTOR SEARCH START");

    console.log("========================================");

    console.log("User Query:", query);

    console.log("Filters:", filters);

    // =====================================================
    // 1. Generate Query Embedding
    // =====================================================

    const queryEmbedding = await generateQueryEmbedding(query);

    console.log("Query embedding generated:", queryEmbedding.length);

    // =====================================================
    // 2. Build Vector Filters
    // =====================================================

    const vectorFilter = buildVectorFilter(filters);

    console.log("Vector filter:", vectorFilter || "No filters");

    // =====================================================
    // 3. Check Restaurants With Embeddings
    // =====================================================

    const restaurantsWithEmbeddings = await Restaurant.countDocuments({
      embedding: {
        $exists: true,
        $ne: [],
      },
    });

    console.log("Restaurants with embeddings:", restaurantsWithEmbeddings);

    // =====================================================
    // 4. Build $vectorSearch
    // =====================================================

    const vectorSearchStage = {
      $vectorSearch: {
        index: "vector_indexrestaurant_vector_index",

        path: "embedding",

        queryVector: queryEmbedding,

        numCandidates: 100,

        limit: Number(limit),
      },
    };

    // =====================================================
    // Add Filter Only When Needed
    // =====================================================

    if (vectorFilter) {
      vectorSearchStage.$vectorSearch.filter = vectorFilter;
    }

    // =====================================================
    // 5. Execute Search
    // =====================================================

    const restaurants = await Restaurant.aggregate([
      vectorSearchStage,

      // =====================================================
      // Similarity Score
      // =====================================================

      {
        $addFields: {
          score: {
            $meta: "vectorSearchScore",
          },
        },
      },

      // =====================================================
      // Return Restaurant Data
      // =====================================================

      {
        $project: {
          name: 1,
          description: 1,
          image: 1,
          cuisine: 1,
          area: 1,
          address: 1,
          phone: 1,
          price: 1,
          rating: 1,
          ratingCount: 1,
          openingTime: 1,
          closingTime: 1,
          location: 1,
          score: 1,
        },
      },
    ]);

    // =====================================================
    // 6. Results
    // =====================================================

    console.log("Vector Search Results:", restaurants.length);

    console.log(
      "Results:",
      restaurants.map((restaurant) => ({
        name: restaurant.name,
        cuisine: restaurant.cuisine,
        area: restaurant.area,
        rating: restaurant.rating,
        score: restaurant.score,
      })),
    );

    console.log("\n========================================");

    console.log("VECTOR SEARCH END");

    console.log("========================================\n");

    return restaurants;
  } catch (error) {
    console.error("\n========================================");

    console.error("VECTOR SEARCH ERROR");

    console.error("========================================");

    console.error("Message:", error?.message);

    console.error("Name:", error?.name);

    console.error("Code:", error?.code);

    console.error("Full Error:", error);

    console.error("========================================\n");

    throw error;
  }
};

module.exports = {
  vectorSearchRestaurants,
};
