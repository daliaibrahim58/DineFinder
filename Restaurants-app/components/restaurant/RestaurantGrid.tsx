import { Box, Typography } from "@mui/material";

import RestaurantCard from "./RestaurantCard";

import type { Restaurant } from "@/types/restaurant";

interface RestaurantGridProps {
  restaurants: Restaurant[];
}

export default function RestaurantGrid({ restaurants }: RestaurantGridProps) {
  if (restaurants.length === 0) {
    return (
      <Typography
        align="center"
        color="text.secondary"
        sx={{
          py: 6,
        }}
      >
        No restaurants found.
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",

        gridTemplateColumns: {
          xs: "1fr",

          sm: "repeat(2, 1fr)",

          md: "repeat(3, 1fr)",

          lg: "repeat(4, 1fr)",
        },

        gap: 3,
      }}
    >
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant._id} restaurant={restaurant} />
      ))}
    </Box>
  );
}
