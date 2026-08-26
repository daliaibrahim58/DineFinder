const Review = require("../models/Review");
const Restaurant = require("../models/Restaurant");

const createReview = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { rating, comment } = req.body;

    if (!rating) {
      return res.status(400).json({
        success: false,
        message: "Rating is required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      restaurant: restaurantId,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You already reviewed this restaurant",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      restaurant: restaurantId,
      rating,
      comment,
    });

    const totalRating =
      restaurant.rating * restaurant.ratingCount + Number(rating);
    restaurant.ratingCount += 1;

    restaurant.rating = totalRating / restaurant.ratingCount;

    restaurant.rating = Number(restaurant.rating.toFixed(2));

    await restaurant.save();
    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getRestaurantReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(400).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const reviews = await Review.find({
      restaurant: restaurantId,
    })
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully",
      rating: {
        average: restaurant.rating,
        count: restaurant.ratingCount,
      },
      data: reviews,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    const { rating, comment } = req.body;

    const review = await Review.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    const restaurant = await Restaurant.findById(review.restaurant);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const oldRating = review.rating;

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }

      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    await review.save();

    const oldTotal = restaurant.rating * restaurant.ratingCount;

    const newTotal = oldTotal - oldRating + review.rating;

    restaurant.rating = newTotal / restaurant.ratingCount;

    restaurant.rating = Number(restaurant.rating.toFixed(2));

    await restaurant.save();

    return res.status(200).json({
      success: true,

      message: "Review updated successfully",

      data: review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!review) {
      return res.status(404).json({
        success: false,

        message: "Review not found",
      });
    }

    const restaurant = await Restaurant.findById(review.restaurant);

    if (!restaurant) {
      return res.status(404).json({
        success: false,

        message: "Restaurant not found",
      });
    }

    const oldTotal = restaurant.rating * restaurant.ratingCount;

    const newTotal = oldTotal - review.rating;

    restaurant.ratingCount -= 1;

    if (restaurant.ratingCount === 0) {
      restaurant.rating = 0;
    } else {
      restaurant.rating = newTotal / restaurant.ratingCount;

      restaurant.rating = Number(restaurant.rating.toFixed(2));
    }

    await review.deleteOne();

    await restaurant.save();

    return res.status(200).json({
      success: true,

      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = {
  createReview,
  getRestaurantReviews,
  updateReview,
  deleteReview,
};
