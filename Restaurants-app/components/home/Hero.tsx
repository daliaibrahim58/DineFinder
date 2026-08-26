"use client";

import dynamic from "next/dynamic";

import { Box, Container, Typography } from "@mui/material";

// =====================================================
// SearchBar
// =====================================================

const SearchBar = dynamic(() => import("./SearchBar"), {
  ssr: false,
  loading: () => null,
});

// =====================================================
// Hero
// =====================================================

export default function Hero() {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)",
        py: {
          xs: 8,
          md: 12,
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            maxWidth: 800,
            mx: "auto",
            textAlign: "center",
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: {
                xs: "2.5rem",
                md: "4rem",
              },
              fontWeight: 800,
              lineHeight: 1.1,
              color: "#111827",
              mb: 2,
            }}
          >
            Find Your Perfect
            <Box
              component="span"
              sx={{
                display: "block",
                color: "#E85D04",
              }}
            >
              Restaurant
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: {
                xs: "1rem",
                md: "1.2rem",
              },
              color: "#6B7280",
              mb: 4,
              maxWidth: 600,
              mx: "auto",
            }}
          >
            Discover amazing restaurants, explore new cuisines, and find your
            next favorite place to eat.
          </Typography>

          <SearchBar />
        </Box>
      </Container>
    </Box>
  );
}
