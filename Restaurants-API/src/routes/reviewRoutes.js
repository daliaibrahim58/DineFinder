const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createReview,
  getRestaurantReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.post("/restaurants/:restaurantId", protect, createReview);

router.get("/restaurants/:restaurantId", getRestaurantReviews);

router.put("/restaurants/:restaurantId", protect, updateReview);

router.delete("/restaurants/:restaurantId", protect, deleteReview);

module.exports = router;
