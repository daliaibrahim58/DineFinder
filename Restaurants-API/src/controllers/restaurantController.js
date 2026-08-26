const Restaurant = require("../models/Restaurant");

// =====================================================
// Get All Restaurants
// =====================================================

const getRestaurants = async (req, res) => {
  try {
    const {
      search,
      cuisine,
      area,
      minPrice,
      maxPrice,
      sort,
      minRating,
      page = 1,
      limit = 10,
    } = req.query;

    // =====================================================
    // Filter
    // =====================================================

    const filter = {};

    // Search
    if (search) {
      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          cuisine: {
            $regex: search,
            $options: "i",
          },
        },
        {
          area: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // Cuisine
    if (cuisine) {
      filter.cuisine = cuisine;
    }

    // Area
    if (area) {
      filter.area = area;
    }

    // Price
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    // Rating
    if (minRating) {
      filter.rating = {
        $gte: Number(minRating),
      };
    }

    // =====================================================
    // Pagination
    // =====================================================

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    // =====================================================
    // Sorting
    // =====================================================

    let sortOptions = {
      rating: -1,
    };

    if (sort === "rating_desc") {
      sortOptions = {
        rating: -1,
      };
    }

    if (sort === "rating_asc") {
      sortOptions = {
        rating: 1,
      };
    }

    if (sort === "price-asc") {
      sortOptions = {
        price: 1,
      };
    }

    if (sort === "price-desc") {
      sortOptions = {
        price: -1,
      };
    }

    if (sort === "newest") {
      sortOptions = {
        createdAt: -1,
      };
    }

    // =====================================================
    // Count
    // =====================================================

    const totalRestaurants =
      await Restaurant.countDocuments(filter);

    // =====================================================
    // Get Restaurants
    // =====================================================

    const restaurants = await Restaurant.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    // =====================================================
    // Total Pages
    // =====================================================

    const totalPages = Math.ceil(
      totalRestaurants / limitNumber
    );

    // =====================================================
    // Response
    // =====================================================

    return res.status(200).json({
      success: true,
      message: "Restaurant fetched successfully",

      pagination: {
        page: pageNumber,
        limit: limitNumber,
        totalRestaurants,
        totalPages,
      },

      data: restaurants,
    });
  } catch (error) {
    console.error(
      "Get Restaurants Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get Restaurant By ID
// =====================================================

const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant =
      await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant fetched successfully",
      data: restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Create Restaurant - Admin
// =====================================================

const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      description,
      image,
      cuisine,
      area,
      address,
      phone,
      price,
      openingTime,
      closingTime,
      location,
    } = req.body;

    if (!name || !cuisine || !area || !address) {
      return res.status(400).json({
        success: false,
        message: "Fields are required",
      });
    }

    const restaurant =
      await Restaurant.create({
        name,
        description,
        image,
        cuisine,
        area,
        address,
        phone,
        price,
        openingTime,
        closingTime,
        location,
      });

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Update Restaurant - Admin
// =====================================================

const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant =
      await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const {
      name,
      description,
      image,
      cuisine,
      area,
      address,
      phone,
      price,
      openingTime,
      closingTime,
      location,
    } = req.body;

    if (name !== undefined) {
      restaurant.name = name;
    }

    if (description !== undefined) {
      restaurant.description = description;
    }

    if (image !== undefined) {
      restaurant.image = image;
    }

    if (cuisine !== undefined) {
      restaurant.cuisine = cuisine;
    }

    if (area !== undefined) {
      restaurant.area = area;
    }

    if (address !== undefined) {
      restaurant.address = address;
    }

    if (phone !== undefined) {
      restaurant.phone = phone;
    }

    if (price !== undefined) {
      restaurant.price = price;
    }

    if (openingTime !== undefined) {
      restaurant.openingTime = openingTime;
    }

    if (closingTime !== undefined) {
      restaurant.closingTime = closingTime;
    }

    if (location !== undefined) {
      restaurant.location = location;
    }

    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: restaurant,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Delete Restaurant - Admin
// =====================================================

const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    const restaurant =
      await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    await restaurant.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get Nearby Restaurants
// =====================================================

const getNearbyRestaurants = async (req, res) => {
  try {
    const {
      longitude,
      latitude,
      distance = 5,
    } = req.query;

    if (!longitude || !latitude) {
      return res.status(400).json({
        success: false,
        message:
          "Longitude and latitude are required",
      });
    }

    const longitudeNumber = Number(longitude);
    const latitudeNumber = Number(latitude);
    const distanceNumber = Number(distance);

    const restaurants =
      await Restaurant.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [
                longitudeNumber,
                latitudeNumber,
              ],
            },

            $maxDistance:
              distanceNumber * 1000,
          },
        },
      });

    return res.status(200).json({
      success: true,
      message:
        "Nearby restaurants fetched successfully",
      data: restaurants,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Exports
// =====================================================

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getNearbyRestaurants,
};