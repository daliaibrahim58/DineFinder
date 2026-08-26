const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getNearbyRestaurants,
} = require("../controllers/restaurantController");

router.get("/", getRestaurants);
router.get("/:id", getRestaurantById);
router.get("/nearby", getNearbyRestaurants);

router.post("/", protect, admin, createRestaurant);
router.put("/:id", protect, admin, updateRestaurant);

router.delete("/:id", protect, admin, deleteRestaurant);

module.exports = router;

