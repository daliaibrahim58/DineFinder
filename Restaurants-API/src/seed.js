const mongoose = require("mongoose");

const Restaurant = require("./models/Restaurant");
const restaurants = require("./data/restaurants");

require("dotenv").config();

const seedRestaurants = async () => {
    try {

        await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB connected");

        // Delete old restaurants
        await Restaurant.deleteMany({});

        // Insert restaurants
        await Restaurant.insertMany(restaurants);

        console.log(
            `${restaurants.length} restaurants inserted successfully`
        );

        await mongoose.connection.close();

        process.exit(0);

    } catch (error) {

        console.error("Seeding error:", error);

        await mongoose.connection.close();

        process.exit(1);
    }
};

seedRestaurants();