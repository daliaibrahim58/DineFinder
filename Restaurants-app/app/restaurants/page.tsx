"use client";

import {
  Box,
  Container,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import { useGetRestaurantsQuery } from "@/redux/api/restaurantApi";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { setFilters } from "@/redux/slices/filterSlice";

import { clearRagResults } from "@/redux/slices/ragSlice";

import RestaurantFilters from "@/components/restaurant/RestaurantFilters";

import RestaurantGrid from "@/components/restaurant/RestaurantGrid";

import Pagination from "@/components/pagination/Pagination";

export default function RestaurantsPage() {
  const dispatch = useAppDispatch();

  // =====================================================
  // Normal Filters
  // =====================================================

  const filters = useAppSelector((state) => state.filter.filters);

  // =====================================================
  // RAG State
  // =====================================================

  const rag = useAppSelector((state) => state.rag);

  // =====================================================
  // Has RAG Results
  // =====================================================

  const hasRagResults = rag.restaurants.length > 0;

  // =====================================================
  // Normal Query Filters
  // =====================================================

  const queryFilters = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== null && value !== undefined,
    ),
  ) as Parameters<typeof useGetRestaurantsQuery>[0];

  // =====================================================
  // Normal API
  // =====================================================

  const { data, isLoading, isError } = useGetRestaurantsQuery(queryFilters, {
    skip: hasRagResults,
  });

  // =====================================================
  // Search Input
  // =====================================================

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    dispatch(
      setFilters({
        ...filters,

        search: value,

        page: 1,
      }),
    );

    // Clear previous RAG
    // if query changed
    if (value !== rag.query) {
      dispatch(clearRagResults());
    }
  };

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 5,
      }}
    >
      {/* =================================================
          Header
      ================================================= */}

      <Typography
        variant="h3"
        component="h1"
        sx={{
          mb: 1,

          fontWeight: 800,
        }}
      >
        Restaurants
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mb: 4,
        }}
      >
        Discover restaurants and find your perfect place to eat.
      </Typography>

      {/* =================================================
          Search
      ================================================= */}

      <TextField
        fullWidth
        value={hasRagResults ? rag.query : filters.search}
        onChange={handleSearch}
        placeholder="Search restaurants..."
        sx={{
          mb: 4,

          backgroundColor: "#FFFFFF",
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* =================================================
          RAG Answer
      ================================================= */}

      {hasRagResults && rag.answer && (
        <Box
          sx={{
            mb: 4,

            p: 3,

            borderRadius: 3,

            backgroundColor: "#FFF7ED",

            border: "1px solid #FED7AA",
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,

              color: "#E85D04",

              mb: 1,
            }}
          >
            AI Recommendation
          </Typography>

          <Typography
            sx={{
              lineHeight: 1.8,
            }}
          >
            {rag.answer}
          </Typography>
        </Box>
      )}

      {/* =================================================
          Main Layout
      ================================================= */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",

            md: "280px 1fr",
          },

          gap: 4,
        }}
      >
        {/* =================================================
            Filters
        ================================================= */}

        <RestaurantFilters />

        {/* =================================================
            Results
        ================================================= */}

        <Box>
          {/* =================================================
              RAG Results
          ================================================= */}

          {hasRagResults ? (
            <>
              <Typography
                color="text.secondary"
                sx={{
                  mb: 3,
                }}
              >
                {rag.restaurants.length} restaurants found
              </Typography>

              <RestaurantGrid restaurants={rag.restaurants} />
            </>
          ) : (
            <>
              {/* Normal Count */}

              {data && (
                <Typography
                  color="text.secondary"
                  sx={{
                    mb: 3,
                  }}
                >
                  {data.pagination.totalRestaurants} restaurants found
                </Typography>
              )}

              {/* Loading */}

              {isLoading && <Typography>Loading restaurants...</Typography>}

              {/* Error */}

              {isError && (
                <Typography color="error">
                  Failed to load restaurants.
                </Typography>
              )}

              {/* Normal Results */}

              {!isLoading && !isError && data && (
                <>
                  <RestaurantGrid restaurants={data.data} />

                  <Pagination totalPages={data.pagination.totalPages} />
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}
