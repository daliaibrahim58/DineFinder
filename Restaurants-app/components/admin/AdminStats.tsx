"use client";

import {
  Box,
  Paper,
  Typography,
  Chip,
} from "@mui/material";

interface AdminStatsProps {
  totalRestaurants: number;
  adminName?: string;
  isFetching: boolean;
}

export default function AdminStats({
  totalRestaurants,
  adminName,
  isFetching,
}: AdminStatsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(3, 1fr)",
        },
        gap: 2,
        mb: 4,
      }}
    >
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >
        <Typography
          color="text.secondary"
          variant="body2"
        >
          Total Restaurants
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mt: 1,
          }}
        >
          {totalRestaurants}
        </Typography>
      </Paper>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >
        <Typography
          color="text.secondary"
          variant="body2"
        >
          Admin
        </Typography>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            mt: 1,
          }}
        >
          {adminName || "Admin"}
        </Typography>
      </Paper>

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >
        <Typography
          color="text.secondary"
          variant="body2"
        >
          Status
        </Typography>

        <Chip
          label={isFetching ? "Refreshing" : "Active"}
          color={isFetching ? "default" : "success"}
          sx={{ mt: 1 }}
        />
      </Paper>
    </Box>
  );
}