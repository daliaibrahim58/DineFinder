require("dotenv").config();

const mongoose = require("mongoose");

const Restaurant = require("../models/Restaurant");

const { generateRestaurantEmbedding } = require("../services/embeddingService");

// =====================================================
// MongoDB Connection
// =====================================================

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);

    process.exit(1);
  }
};

// =====================================================
// Create Restaurant Text
// =====================================================

const createRestaurantText = (restaurant) => {
  return `
Restaurant Name: ${restaurant.name}

Cuisine: ${restaurant.cuisine}

Area: ${restaurant.area}

Address: ${restaurant.address}

Price: ${restaurant.price ?? "Not specified"}

Rating: ${restaurant.rating ?? 0}

Rating Count: ${restaurant.ratingCount ?? 0}

Opening Time: ${restaurant.openingTime ?? "Not specified"}

Closing Time: ${restaurant.closingTime ?? "Not specified"}

Description: ${restaurant.description ?? "No description available"}
`.trim();
};

// =====================================================
// Generate Embeddings
// =====================================================

const createEmbeddings = async () => {
  try {
    await connectDB();

    const restaurants = await Restaurant.find({});

    console.log(`Found ${restaurants.length} restaurants`);

    if (!restaurants.length) {
      console.log("No restaurants found");

      process.exit(0);
    }

    for (let i = 0; i < restaurants.length; i++) {
      const restaurant = restaurants[i];

      console.log(`\n[${i + 1}/${restaurants.length}] ${restaurant.name}`);

      // Skip if embedding already exists
      if (restaurant.embedding && restaurant.embedding.length > 0) {
        console.log("Embedding already exists - skipped");

        continue;
      }

      const restaurantText = createRestaurantText(restaurant);

      console.log("Creating embedding...");

      const embedding = await generateRestaurantEmbedding(restaurantText);

      restaurant.embedding = embedding;

      await restaurant.save();

      console.log(`Embedding saved (${embedding.length} dimensions)`);

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log("\n========================================");

    console.log("All restaurant embeddings created successfully!");

    console.log("========================================");

    process.exit(0);
  } catch (error) {
    console.error("\nEmbedding script failed:");

    console.error(error);

    process.exit(1);
  }
};

// =====================================================
// Run
// =====================================================

createEmbeddings();
