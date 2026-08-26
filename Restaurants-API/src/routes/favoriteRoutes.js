const express = require("express");

const {
  addFavorite,
  removeFavorite,
  getFavorites,
} = require("../controllers/favoriteController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get user's favorites
router.get("/", protect, getFavorites);

// Add favorite
router.post("/:restaurantId", protect, addFavorite);

// Remove favorite
router.delete("/:restaurantId", protect, removeFavorite);

module.exports = router;
