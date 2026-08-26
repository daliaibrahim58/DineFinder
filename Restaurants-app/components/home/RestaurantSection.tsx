"use client";

import Link from "next/link";

import {
  Box,
  Container,
  Typography,
  Button,
  Skeleton,
} from "@mui/material";

import RestaurantGrid from "../restaurant/RestaurantGrid";
import RestaurantCard from "../restaurant/RestaurantCard";

import { useGetRestaurantsQuery } from "@/redux/api/restaurantApi";

import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function RestaurantSection() {
  // =====================================================
  // Get Restaurants
  // =====================================================

  const { data, isLoading, isError } = useGetRestaurantsQuery({
    page: 1,
    limit: 8,
    sort: "rating_desc",
  });

  // =====================================================
  // Restaurants
  // =====================================================

  const restaurants = data?.data || [];

  // =====================================================
  // UI
  // =====================================================

  return (
    <Container
      maxWidth="xl"
      sx={{
        py: 8,
      }}
    >
      {/* =================================================
          Header
      ================================================= */}

      <Box
        sx={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: {
            xs: "flex-start",
            sm: "center",
          },

          gap: 2,

          mb: 4,
        }}
      >
        {/* =================================================
            Title
        ================================================= */}

        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,

              fontSize: {
                xs: "1.7rem",
                sm: "2rem",
                md: "2.125rem",
              },
            }}
          >
            Popular Restaurants
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,

              fontSize: {
                xs: "0.9rem",
                sm: "1rem",
              },
            }}
          >
            Discover the most loved restaurants around you.
          </Typography>
        </Box>

        {/* =================================================
            View All
        ================================================= */}

        <Button
          component={Link}
          href="/restaurants"
          sx={{
            color: "#E85D04",

            fontWeight: 700,

            whiteSpace: "nowrap",

            minWidth: "auto",

            px: 1,
          }}
        >
          View All →
        </Button>
      </Box>

      {/* =================================================
          Loading
      ================================================= */}

      {isLoading && (
        <>
          {/* =================================================
              Desktop Loading
          ================================================= */}

          <Box
            sx={{
              display: {
                xs: "none",
                sm: "grid",
              },

              gridTemplateColumns: {
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },

              gap: 3,
            }}
          >
            {Array.from({
              length: 8,
            }).map((_, index) => (
              <Box key={index}>
                <Skeleton
                  variant="rounded"
                  height={220}
                />

                <Skeleton
                  width="70%"
                  sx={{
                    mt: 1,
                  }}
                />

                <Skeleton width="50%" />
              </Box>
            ))}
          </Box>

          {/* =================================================
              Mobile Loading
          ================================================= */}

          <Box
            sx={{
              display: {
                xs: "block",
                sm: "none",
              },
            }}
          >
            <Skeleton
              variant="rounded"
              height={400}
              sx={{
                borderRadius: 3,
              }}
            />

            <Skeleton
              width="70%"
              sx={{
                mt: 1,
              }}
            />

            <Skeleton width="50%" />
          </Box>
        </>
      )}

      {/* =================================================
          Error
      ================================================= */}

      {isError && (
        <Typography
          color="error"
          align="center"
          sx={{
            py: 5,
          }}
        >
          Failed to load restaurants.
        </Typography>
      )}

      {/* =================================================
          Restaurants
      ================================================= */}

      {!isLoading &&
        !isError &&
        restaurants.length > 0 && (
          <>
            {/* =================================================
                DESKTOP + TABLET

                EXACTLY YOUR EXISTING GRID
            ================================================= */}

            <Box
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            >
              <RestaurantGrid
                restaurants={restaurants}
              />
            </Box>

            {/* =================================================
                MOBILE ONLY

                SAME RESTAURANT CARD
                INSIDE SWIPER
            ================================================= */}

            <Box
              sx={{
                display: {
                  xs: "block",
                  sm: "none",
                },

                position: "relative",

                // =================================================
                // Swiper
                // =================================================

                "& .swiper": {
                  position: "relative",

                  padding: "5px 5px 40px",
                },

                // =================================================
                // Swiper Arrows
                // =================================================

                "& .swiper-button-next, & .swiper-button-prev":
                  {
                    position: "absolute",

                    top: "29%",

                    transform: "translateY(-29%)",

                    width: 32,

                    height: 32,

                    marginTop: 0,

                    borderRadius: "50%",

                    backgroundColor: "#F5F5F5",

                    color: "#E85D04",

                    boxShadow:
                      "0 3px 12px rgba(0,0,0,0.18)",

                    zIndex: 20,

                    transition:
                      "all 0.2s ease",

                    "&:hover": {
                      backgroundColor:
                        "#E85D04",

                      color: "#F5F5F5",
                    },

                    "&::after": {
                      fontSize: 14,

                      fontWeight: 900,
                    },
                  },

                // =================================================
                // Previous Arrow
                // =================================================

                "& .swiper-button-prev": {
                  left: 0,
                },

                // =================================================
                // Next Arrow
                // =================================================

                "& .swiper-button-next": {
                  right: 0,
                },

                // =================================================
                // Pagination
                // =================================================

                "& .swiper-pagination": {
                  bottom: 5,
                },

                "& .swiper-pagination-bullet": {
                  width: 7,

                  height: 7,

                  backgroundColor:
                    "#E85D04",

                  opacity: 0.3,
                },

                "& .swiper-pagination-bullet-active":
                  {
                    width: 20,

                    borderRadius: 10,

                    opacity: 1,

                    backgroundColor:
                      "#E85D04",
                  },
              }}
            >
              <Swiper
                modules={[
                  Navigation,
                  Pagination,
                ]}
                navigation={
                  restaurants.length > 1
                }
                pagination={{
                  clickable: true,
                }}
                slidesPerView={1}
                spaceBetween={16}
                watchOverflow
                grabCursor
              >
                {restaurants.map(
                  (restaurant) => (
                    <SwiperSlide
                      key={restaurant._id}
                      style={{
                        height: "auto",

                        display: "flex",
                      }}
                    >
                      {/* =================================================
                          SAME CARD USED BY RESTAURANT GRID
                      ================================================= */}

                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <RestaurantCard
                          restaurant={
                            restaurant
                          }
                        />
                      </Box>
                    </SwiperSlide>
                  )
                )}
              </Swiper>
            </Box>
          </>
        )}

      {/* =================================================
          No Restaurants
      ================================================= */}

      {!isLoading &&
        !isError &&
        restaurants.length === 0 && (
          <Typography
            align="center"
            color="text.secondary"
            sx={{
              py: 5,
            }}
          >
            No restaurants found.
          </Typography>
        )}
    </Container>
  );
}