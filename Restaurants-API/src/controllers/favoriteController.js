const User = require("../models/User");
const Restaurant = require("../models/Restaurant");

// =====================================================
// Add Favorite
// =====================================================

const addFavorite = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Check restaurant exists
    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // Check if already favorite
    const alreadyFavorite = req.user.favorites.some(
      (id) => id.toString() === restaurantId,
    );

    if (alreadyFavorite) {
      return res.status(400).json({
        success: false,
        message: "Restaurant already in favorites",
      });
    }

    // Add favorite
    req.user.favorites.push(restaurantId);

    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant added to favorites",
      data: {
        favorites: req.user.favorites,
      },
    });
  } catch (error) {
    console.error("Add Favorite Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Remove Favorite
// =====================================================

const removeFavorite = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    req.user.favorites = req.user.favorites.filter(
      (id) => id.toString() !== restaurantId,
    );

    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Restaurant removed from favorites",
      data: {
        favorites: req.user.favorites,
      },
    });
  } catch (error) {
    console.error("Remove Favorite Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// Get Favorites
// =====================================================

const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("favorites");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        favorites: user.favorites,
      },
    });
  } catch (error) {
    console.error("Get Favorites Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getFavorites,
};
