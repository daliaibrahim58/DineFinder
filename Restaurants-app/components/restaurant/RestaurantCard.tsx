"use client";

import { useState } from "react";

import Link from "next/link";

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Rating,
  IconButton,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";

import { Favorite, FavoriteBorder } from "@mui/icons-material";

import type { Restaurant } from "@/types/restaurant";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { setUser } from "@/redux/slices/authSlice";

import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "@/redux/api/favoriteApi";

// =====================================================
// Props
// =====================================================

interface RestaurantCardProps {
  restaurant: Restaurant;
}

// =====================================================
// Component
// =====================================================

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const dispatch = useAppDispatch();

  // ===================================================
  // Auth
  // ===================================================

  const user = useAppSelector((state) => state.auth.user);

  // ===================================================
  // Favorite API
  // ===================================================

  const [addFavorite, { isLoading: isAdding }] = useAddFavoriteMutation();

  const [removeFavorite, { isLoading: isRemoving }] =
    useRemoveFavoriteMutation();

  const isFavorite = user?.favorites?.includes(restaurant._id) ?? false;

  const isFavoriteLoading = isAdding || isRemoving;

  // ===================================================
  // Snackbar
  // ===================================================

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // ===================================================
  // Favorite Handler
  // ===================================================

  const handleFavorite = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // User not logged in
    if (!user) {
      setSnackbar({
        open: true,
        message: "Please login to add favorites",
        severity: "error",
      });

      return;
    }

    // Prevent multiple clicks
    if (isFavoriteLoading) {
      return;
    }

    try {
      // =============================================
      // Remove Favorite
      // =============================================

      if (isFavorite) {
        const response = await removeFavorite(restaurant._id).unwrap();

        dispatch(
          setUser({
            ...user,
            favorites: response.data.favorites.map((id) => id.toString()),
          }),
        );

        setSnackbar({
          open: true,
          message: "Removed from favorites",
          severity: "success",
        });

        return;
      }

      // =============================================
      // Add Favorite
      // =============================================

      const response = await addFavorite(restaurant._id).unwrap();

      dispatch(
        setUser({
          ...user,
          favorites: response.data.favorites.map((id) => id.toString()),
        }),
      );

      setSnackbar({
        open: true,
        message: "Added to favorites",
        severity: "success",
      });
    } catch (error) {
      console.error("Favorite Error:", error);

      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error",
      });
    }
  };

  // ===================================================
  // Close Snackbar
  // ===================================================

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  // ===================================================
  // Render
  // ===================================================

  return (
    <>
      <Card
        sx={{
          height: "100%",

          minHeight: 430,

          display: "flex",

          flexDirection: "column",

          position: "relative",

          borderRadius: 2,

          overflow: "hidden",

          transition: "transform 0.2s ease, box-shadow 0.2s ease",

          "&:hover": {
            transform: "translateY(-4px)",

            boxShadow: 4,
          },
        }}
      >
        {/* ================================================= */}
        {/* Favorite Button */}
        {/* ================================================= */}

        <IconButton
          onClick={handleFavorite}
          disabled={isFavoriteLoading}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          sx={{
            position: "absolute",

            top: 10,

            right: 10,

            zIndex: 2,

            backgroundColor: "rgba(255,255,255,0.9)",

            "&:hover": {
              backgroundColor: "rgba(255,255,255,1)",
            },
          }}
        >
          {isFavoriteLoading ? (
            <CircularProgress size={22} />
          ) : isFavorite ? (
            <Favorite
              sx={{
                color: "#e53935",
              }}
            />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>

        {/* ================================================= */}
        {/* Restaurant Link */}
        {/* ================================================= */}

        <Link
          href={`/restaurants/${restaurant._id}`}
          style={{
            textDecoration: "none",

            color: "inherit",

            display: "flex",

            flexDirection: "column",

            height: "100%",
          }}
        >
          {/* ================================================= */}
          {/* Image */}
          {/* ================================================= */}

          <CardMedia
            component="img"
            image={restaurant.image || "/images/restaurant-placeholder.jpg"}
            alt={restaurant.name}
            sx={{
              height: 220,

              minHeight: 220,

              objectFit: "cover",

              flexShrink: 0,
            }}
          />

          {/* ================================================= */}
          {/* Content */}
          {/* ================================================= */}

          <CardContent
            sx={{
              flex: 1,

              display: "flex",

              flexDirection: "column",

              minHeight: 210,
            }}
          >
            {/* Restaurant Name */}

            <Typography
              variant="h6"
              gutterBottom
              noWrap
              sx={{
                fontWeight: 600,

                minHeight: 29,
              }}
            >
              {restaurant.name}
            </Typography>

            {/* Cuisine */}

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1,

                minHeight: 20,

                overflow: "hidden",

                textOverflow: "ellipsis",

                whiteSpace: "nowrap",
              }}
            >
              {restaurant.cuisine || "Restaurant"}
            </Typography>

            {/* Area */}

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 1.5,

                minHeight: 20,

                overflow: "hidden",

                textOverflow: "ellipsis",

                whiteSpace: "nowrap",
              }}
            >
              {restaurant.area || "Location not available"}
            </Typography>

            {/* Rating */}

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1,

                minHeight: 24,
              }}
            >
              <Rating
                value={restaurant.rating || 0}
                precision={0.5}
                readOnly
                size="small"
              />

              <Typography variant="body2" color="text.secondary">
                {restaurant.rating?.toFixed(1) || "0.0"}
              </Typography>
            </Box>

            {/* Price */}

            <Typography
              variant="body2"
              sx={{
                mt: "auto",

                pt: 1,

                fontWeight: 600,

                minHeight: 28,
              }}
            >
              {restaurant.price !== undefined
                ? `${restaurant.price} EGP`
                : "Price not available"}
            </Typography>
          </CardContent>
        </Link>
      </Card>

      {/* =================================================== */}
      {/* Snackbar */}
      {/* =================================================== */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
