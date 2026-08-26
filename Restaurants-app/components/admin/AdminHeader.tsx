"use client";

import {
  Box,
  Typography,
  Button,
} from "@mui/material";

import { Add } from "@mui/icons-material";

interface AdminHeaderProps {
  onAdd: () => void;
}

export default function AdminHeader({
  onAdd,
}: AdminHeaderProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 4,
        gap: 2,
        flexWrap: "wrap",
      }}
    >
      <Box>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
          }}
        >
          Admin Dashboard
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Manage restaurants and restaurant data.
        </Typography>
      </Box>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={onAdd}
        sx={{
          backgroundColor: "#E85D04",
          "&:hover": {
            backgroundColor: "#D94F00",
          },
        }}
      >
        Add Restaurant
      </Button>
    </Box>
  );
}