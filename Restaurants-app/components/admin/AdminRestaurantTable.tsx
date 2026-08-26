"use client";

import {
  Box,
  Typography,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";

import {
  Edit,
  Delete,
  Restaurant as RestaurantIcon,
} from "@mui/icons-material";

import type {
  Restaurant,
} from "@/types/restaurant";

interface AdminRestaurantTableProps {
  restaurants: Restaurant[];
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (restaurant: Restaurant) => void;
}

export default function AdminRestaurantTable({
  restaurants,
  onEdit,
  onDelete,
}: AdminRestaurantTableProps) {
  if (restaurants.length === 0) {
    return (
      <Paper
        sx={{
          borderRadius: 3,
          p: 8,
          textAlign: "center",
        }}
      >
        <RestaurantIcon
          sx={{
            fontSize: 50,
            color: "#9CA3AF",
          }}
        />

        <Typography
          sx={{
            mt: 1,
            fontWeight: 700,
          }}
        >
          No restaurants found.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {/* Header */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "2fr 1.3fr 1.2fr 0.8fr 0.8fr 0.8fr",
          gap: 2,
          px: 3,
          py: 2,
          backgroundColor: "#F9FAFB",
          fontWeight: 700,
          borderBottom: "1px solid #E5E7EB",
        }}
      >
        <Typography>Restaurant</Typography>

        <Typography>Cuisine</Typography>

        <Typography>Area</Typography>

        <Typography>Rating</Typography>

        <Typography>Price</Typography>

        <Typography>Actions</Typography>
      </Box>

      {/* Rows */}

      {restaurants.map((restaurant) => (
        <Box
          key={restaurant._id}
          sx={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1.3fr 1.2fr 0.8fr 0.8fr 0.8fr",
            gap: 2,
            px: 3,
            py: 2,
            alignItems: "center",
            borderBottom: "1px solid #F1F5F9",
            "&:hover": {
              backgroundColor: "#FFFBF7",
            },
          }}
        >
          {/* Restaurant */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minWidth: 0,
            }}
          >
            <Box
              component="img"
              src={
                restaurant.image ||
                "/images/restaurant-placeholder.jpg"
              }
              alt={restaurant.name}
              sx={{
                width: 55,
                height: 55,
                borderRadius: 2,
                objectFit: "cover",
                flexShrink: 0,
              }}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {restaurant.name}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: "block",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {restaurant.address || "No address"}
              </Typography>
            </Box>
          </Box>

          {/* Cuisine */}

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {restaurant.cuisine || "-"}
          </Typography>

          {/* Area */}

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {restaurant.area || "-"}
          </Typography>

          {/* Rating */}

          <Typography
            sx={{
              fontWeight: 700,
              color: "#E85D04",
            }}
          >
            ★ {restaurant.rating?.toFixed(1) || "0.0"}
          </Typography>

          {/* Price */}

          <Typography variant="body2">
            {restaurant.price !== undefined
              ? `${restaurant.price} EGP`
              : "-"}
          </Typography>

          {/* Actions */}

          <Stack
            direction="row"
            spacing={0.5}
          >
            <IconButton
              size="small"
              onClick={() => onEdit(restaurant)}
              sx={{
                color: "#2563EB",
              }}
            >
              <Edit fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => onDelete(restaurant)}
              sx={{
                color: "#DC2626",
              }}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      ))}
    </Paper>
  );
}