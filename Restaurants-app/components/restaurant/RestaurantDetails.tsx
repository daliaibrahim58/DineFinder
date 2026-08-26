/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Box,
  Container,
  Typography,
  Rating,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

import {
  Favorite,
  FavoriteBorder,
  LocationOn,
  RestaurantMenu,
} from "@mui/icons-material";

import {
  useGetRestaurantByIdQuery,
  useGetRestaurantsQuery,
} from "@/redux/api/restaurantApi";

import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} from "@/redux/api/favoriteApi";

import {
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";

import {
  setUser,
} from "@/redux/slices/authSlice";

import Directions from "./Directions";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Navigation,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// =====================================================
// Props
// =====================================================

interface RestaurantDetailsProps {
  params: {
    id: string;
  };
}

// =====================================================
// Component
// =====================================================

export default function RestaurantDetails({
  params,
}: RestaurantDetailsProps) {
  // =====================================================
  // Restaurant Details
  // =====================================================

  const {
    data,
    isLoading,
    isError,
  } = useGetRestaurantByIdQuery(
    params.id
  );

  // =====================================================
  // Redux
  // =====================================================

  const dispatch =
    useAppDispatch();

  // =====================================================
  // Auth
  // =====================================================

  const {
    user,
    isAuthenticated,
  } = useAppSelector(
    (state) => state.auth
  );

  // =====================================================
  // Favorite API
  // =====================================================

  const [
    addFavorite,
    {
      isLoading:
        isAddingFavorite,
    },
  ] =
    useAddFavoriteMutation();

  const [
    removeFavorite,
    {
      isLoading:
        isRemovingFavorite,
    },
  ] =
    useRemoveFavoriteMutation();

  // =====================================================
  // Favorites
  // =====================================================

  const favorites =
    user?.favorites || [];

  const isFavorite =
    favorites.includes(
      params.id
    );

  const isFavoriteLoading =
    isAddingFavorite ||
    isRemovingFavorite;

  // =====================================================
  // Snackbar
  // =====================================================

  const [
    snackbarOpen,
    setSnackbarOpen,
  ] = useState(false);

  const [
    snackbarMessage,
    setSnackbarMessage,
  ] = useState("");

  const [
    snackbarSeverity,
    setSnackbarSeverity,
  ] = useState<
    "success" | "warning" | "error"
  >("warning");

  // =====================================================
  // Restaurant
  // =====================================================

  const restaurant =
    data?.data;

  // =====================================================
  // Similar Restaurants
  // =====================================================

  const {
    data: similarData,
    isLoading:
      isSimilarLoading,
  } =
    useGetRestaurantsQuery(
      {
        cuisine:
          restaurant?.cuisine ||
          "",

        page: 1,

        limit: 10,
      },
      {
        skip:
          !restaurant?.cuisine ||
          !data ||
          isError,
      }
    );

  // =====================================================
  // Similar Restaurants
  // Remove Current Restaurant
  // =====================================================

  const similarRestaurants =
    similarData?.data?.filter(
      (item: any) =>
        item._id !==
        restaurant?._id
    ) || [];

  // =====================================================
  // Favorite Handler
  // =====================================================

  const handleFavorite =
    async () => {
      // =================================================
      // Not Logged In
      // =================================================

      if (!isAuthenticated || !user) {
        setSnackbarMessage(
          "Please login to add restaurants to your favorites."
        );

        setSnackbarSeverity(
          "warning"
        );

        setSnackbarOpen(true);

        return;
      }

      // =================================================
      // Prevent Multiple Requests
      // =================================================

      if (isFavoriteLoading) {
        return;
      }

      try {
        // =================================================
        // Remove
        // =================================================

        if (isFavorite) {
          const response =
            await removeFavorite(
              params.id
            ).unwrap();

          dispatch(
            setUser({
              ...user,

              favorites:
                response.data.favorites.map(
                  (id) =>
                    id.toString()
                ),
            })
          );

          setSnackbarMessage(
            "Restaurant removed from favorites."
          );

          setSnackbarSeverity(
            "success"
          );

          setSnackbarOpen(true);

          return;
        }

        // =================================================
        // Add
        // =================================================

        const response =
          await addFavorite(
            params.id
          ).unwrap();

        dispatch(
          setUser({
            ...user,

            favorites:
              response.data.favorites.map(
                (id) =>
                  id.toString()
              ),
          })
        );

        setSnackbarMessage(
          "Restaurant added to favorites."
        );

        setSnackbarSeverity(
          "success"
        );

        setSnackbarOpen(true);
      } catch (error) {
        console.error(
          "Favorite Error:",
          error
        );

        setSnackbarMessage(
          "Something went wrong. Please try again."
        );

        setSnackbarSeverity(
          "error"
        );

        setSnackbarOpen(true);
      }
    };

  // =====================================================
  // Loading
  // =====================================================

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight:
            "60vh",

          display:
            "flex",

          justifyContent:
            "center",

          alignItems:
            "center",
        }}
      >
        <CircularProgress
          sx={{
            color:
              "#E85D04",
          }}
        />
      </Box>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (
    isError ||
    !restaurant
  ) {
    return (
      <Container
        sx={{
          py: 8,
        }}
      >
        <Typography
          color="error"
          align="center"
        >
          Restaurant not found.
        </Typography>
      </Container>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <>
      <Container
        maxWidth="lg"
        sx={{
          py: 6,
        }}
      >
        {/* =================================================
            Main Restaurant Details
        ================================================= */}

        <Box
          sx={{
            display:
              "grid",

            gridTemplateColumns: {
              xs: "1fr",

              md: "1fr 1fr",
            },

            gap: 5,
          }}
        >
          {/* =================================================
              Image
          ================================================= */}

          <Box
            component="img"
            src={
              restaurant.image ||
              "/images/restaurant-placeholder.jpg"
            }
            alt={
              restaurant.name
            }
            sx={{
              width:
                "100%",

              height: {
                xs: 300,

                md: 500,
              },

              objectFit:
                "cover",

              borderRadius: 4,
            }}
          />

          {/* =================================================
              Details
          ================================================= */}

          <Box>
            {/* Name + Favorite */}

            <Box
              sx={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "flex-start",

                gap: 2,
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight:
                    800,
                }}
              >
                {
                  restaurant.name
                }
              </Typography>

              <Button
                onClick={
                  handleFavorite
                }
                disabled={
                  isFavoriteLoading
                }
                sx={{
                  minWidth: 50,
                }}
              >
                {isFavoriteLoading ? (
                  <CircularProgress
                    size={26}
                    sx={{
                      color:
                        "#E85D04",
                    }}
                  />
                ) : isFavorite ? (
                  <Favorite
                    sx={{
                      color:
                        "#E85D04",

                      fontSize: 30,
                    }}
                  />
                ) : (
                  <FavoriteBorder
                    sx={{
                      fontSize: 30,
                    }}
                  />
                )}
              </Button>
            </Box>

            {/* Cuisine + Area */}

            <Box
              sx={{
                display:
                  "flex",

                gap: 1,

                mt: 2,

                flexWrap:
                  "wrap",
              }}
            >
              {restaurant.cuisine && (
                <Chip
                  icon={
                    <RestaurantMenu />
                  }
                  label={
                    restaurant.cuisine
                  }
                  sx={{
                    backgroundColor:
                      "#FFF7ED",

                    color:
                      "#E85D04",
                  }}
                />
              )}

              {restaurant.area && (
                <Chip
                  icon={
                    <LocationOn />
                  }
                  label={
                    restaurant.area
                  }
                />
              )}
            </Box>

            {/* Rating */}

            <Box
              sx={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap: 1,

                mt: 3,
              }}
            >
              <Rating
                value={
                  restaurant.rating ||
                  0
                }
                precision={0.1}
                readOnly
              />

              <Typography
                sx={{
                  fontWeight:
                    700,
                }}
              >
                {(
                  restaurant.rating ||
                  0
                ).toFixed(1)}
              </Typography>

              <Typography
                color="text.secondary"
              >
                (
                {restaurant.ratingCount ||
                  0}{" "}
                reviews)
              </Typography>
            </Box>

            <Divider
              sx={{
                my: 4,
              }}
            />

            {/* Description */}

            <Typography
              variant="h6"
              sx={{
                fontWeight:
                  700,

                mb: 1,
              }}
            >
              About
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                lineHeight:
                  1.8,
              }}
            >
              {restaurant.description ||
                "No description available for this restaurant."}
            </Typography>

            {/* Price */}

            {restaurant.price !==
              undefined && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight:
                      700,
                  }}
                >
                  Average Price
                </Typography>

                <Typography
                  variant="h4"
                  sx={{
                    color:
                      "#E85D04",

                    mt: 1,

                    fontWeight:
                      800,
                  }}
                >
                  {restaurant.price} EGP
                </Typography>
              </Box>
            )}

            {/* Location */}

            {restaurant.location && (
              <Box
                sx={{
                  mt: 4,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight:
                      700,

                    mb: 2,
                  }}
                >
                  Location
                </Typography>

                <Directions
                  longitude={
                    restaurant.location
                      .coordinates[0]
                  }
                  latitude={
                    restaurant.location
                      .coordinates[1]
                  }
                  restaurantName={
                    restaurant.name
                  }
                />
              </Box>
            )}
          </Box>
        </Box>

        {/* =================================================
            Similar Restaurants
        ================================================= */}

        <Box
          sx={{
            mt: 8,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight:
                800,

              mb: 1,
            }}
          >
            Similar Restaurants
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            More{" "}
            {restaurant.cuisine}{" "}
            restaurants you may like
          </Typography>

          {/* Loading */}

          {isSimilarLoading && (
            <Box
              sx={{
                minHeight:
                  180,

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",
              }}
            >
              <CircularProgress
                sx={{
                  color:
                    "#E85D04",
                }}
              />
            </Box>
          )}

          {/* Empty */}

          {!isSimilarLoading &&
            similarRestaurants.length ===
              0 && (
              <Typography
                color="text.secondary"
                sx={{
                  py: 3,
                }}
              >
                No similar restaurants found.
              </Typography>
            )}

          {/* Swiper */}

          {!isSimilarLoading &&
            similarRestaurants.length >
              0 && (
              <Box
                sx={{
                  position:
                    "relative",

                  "& .swiper-button-next, & .swiper-button-prev":
                    {
                      width:
                        30,

                      height:
                        30,

                      minWidth:
                        30,

                      minHeight:
                        30,

                      borderRadius:
                        "50%",

                      backgroundColor:
                        "#FFFFFF",

                      color:
                        "#E85D04",

                      boxShadow:
                        "0 3px 10px rgba(0,0,0,0.15)",

                      zIndex:
                        20,

                      marginTop:
                        "-15px",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      justifyContent:
                        "center",

                      "&:hover": {
                        backgroundColor:
                          "#E85D04",

                        color:
                          "#FFFFFF",

                        transform:
                          "scale(1.08)",
                      },

                      "&::after": {
                        fontSize:
                          13,

                        fontWeight:
                          800,

                        lineHeight:
                          1,
                      },
                    },

                  "& .swiper-button-prev":
                    {
                      left: 5,
                    },

                  "& .swiper-button-next":
                    {
                      right: 5,
                    },

                  "& .swiper-pagination":
                    {
                      bottom: 8,
                    },

                  "& .swiper-pagination-bullet":
                    {
                      width: 7,

                      height: 7,

                      backgroundColor:
                        "#E85D04",

                      opacity:
                        0.3,
                    },

                  "& .swiper-pagination-bullet-active":
                    {
                      backgroundColor:
                        "#E85D04",

                      opacity: 1,

                      width: 18,

                      borderRadius:
                        5,
                    },

                  "@media (max-width: 600px)":
                    {
                      "& .swiper-button-next, & .swiper-button-prev":
                        {
                          width:
                            26,

                          height:
                            26,

                          minWidth:
                            26,

                          minHeight:
                            26,

                          marginTop:
                            "-13px",

                          "&::after":
                            {
                              fontSize:
                                11,
                            },
                        },

                      "& .swiper-button-prev":
                        {
                          left: 8,
                        },

                      "& .swiper-button-next":
                        {
                          right: 8,
                        },
                    },
                }}
              >
                <Swiper
                  modules={[
                    Navigation,
                    Pagination,
                  ]}
                  navigation={{
                    enabled:
                      similarRestaurants.length >
                      1,
                  }}
                  pagination={{
                    clickable:
                      true,
                  }}
                  spaceBetween={
                    20
                  }
                  slidesPerView={
                    1
                  }
                  watchOverflow={
                    true
                  }
                  observer={
                    true
                  }
                  observeParents={
                    true
                  }
                  grabCursor={
                    true
                  }
                  allowTouchMove={
                    true
                  }
                  breakpoints={{
                    600: {
                      slidesPerView:
                        2,

                      spaceBetween:
                        20,
                    },

                    900: {
                      slidesPerView:
                        3,

                      spaceBetween:
                        20,
                    },

                    1200: {
                      slidesPerView:
                        4,

                      spaceBetween:
                        20,
                    },
                  }}
                  style={{
                    padding:
                      "10px 5px 50px",
                  }}
                >
                  {similarRestaurants.map(
                    (
                      similarRestaurant: any
                    ) => (
                      <SwiperSlide
                        key={
                          similarRestaurant._id
                        }
                        style={{
                          height:
                            "auto",

                          display:
                            "flex",
                        }}
                      >
                        <Card
                          sx={{
                            width:
                              "100%",

                            height:
                              "100%",

                            minHeight:
                              430,

                            display:
                              "flex",

                            flexDirection:
                              "column",

                            borderRadius:
                              3,

                            overflow:
                              "hidden",

                            boxShadow:
                              "0 6px 20px rgba(0,0,0,0.08)",

                            transition:
                              "transform 0.2s ease, box-shadow 0.2s ease",

                            "&:hover":
                              {
                                transform:
                                  "translateY(-5px)",

                                boxShadow:
                                  "0 12px 30px rgba(0,0,0,0.14)",
                              },
                          }}
                        >
                          <CardMedia
                            component="img"
                            image={
                              similarRestaurant.image ||
                              "/images/restaurant-placeholder.jpg"
                            }
                            alt={
                              similarRestaurant.name
                            }
                            sx={{
                              width:
                                "100%",

                              height:
                                190,

                              minHeight:
                                190,

                              objectFit:
                                "cover",
                            }}
                          />

                          <CardContent
                            sx={{
                              flex: 1,

                              display:
                                "flex",

                              flexDirection:
                                "column",

                              p:
                                2.5,
                            }}
                          >
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight:
                                  700,

                                minHeight:
                                  32,

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {
                                similarRestaurant.name
                              }
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt:
                                  0.5,

                                minHeight:
                                  21,

                                overflow:
                                  "hidden",

                                textOverflow:
                                  "ellipsis",

                                whiteSpace:
                                  "nowrap",
                              }}
                            >
                              {
                                similarRestaurant.cuisine ||
                                "Restaurant"
                              }
                            </Typography>

                            <Box
                              sx={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap:
                                  0.5,

                                mt:
                                  1,

                                minHeight:
                                  24,
                              }}
                            >
                              <LocationOn
                                sx={{
                                  fontSize:
                                    17,

                                  color:
                                    "#E85D04",

                                  flexShrink:
                                    0,
                                }}
                              />

                              <Typography
                                variant="body2"
                                color="text.secondary"
                                noWrap
                              >
                                {
                                  similarRestaurant.area ||
                                  "Location unavailable"
                                }
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                display:
                                  "flex",

                                alignItems:
                                  "center",

                                gap:
                                  1,

                                mt:
                                  1.5,

                                minHeight:
                                  24,
                              }}
                            >
                              <Rating
                                value={
                                  similarRestaurant.rating ||
                                  0
                                }
                                precision={
                                  0.1
                                }
                                size="small"
                                readOnly
                              />

                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight:
                                    700,

                                  flexShrink:
                                    0,
                                }}
                              >
                                {(
                                  similarRestaurant.rating ||
                                  0
                                ).toFixed(
                                  1
                                )}
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                flex: 1,
                              }}
                            />

                            <Button
                              component={
                                Link
                              }
                              href={`/restaurants/${similarRestaurant._id}`}
                              fullWidth
                              variant="contained"
                              sx={{
                                mt:
                                  2,

                                minHeight:
                                  42,

                                backgroundColor:
                                  "#E85D04",

                                borderRadius:
                                  2,

                                fontWeight:
                                  700,

                                "&:hover":
                                  {
                                    backgroundColor:
                                      "#D94F00",
                                  },
                              }}
                            >
                              View Restaurant
                            </Button>
                          </CardContent>
                        </Card>
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              </Box>
            )}
        </Box>
      </Container>

      {/* =====================================================
          Snackbar
      ===================================================== */}

      <Snackbar
        open={
          snackbarOpen
        }
        autoHideDuration={
          4000
        }
        onClose={() =>
          setSnackbarOpen(
            false
          )
        }
        anchorOrigin={{
          vertical:
            "bottom",

          horizontal:
            "center",
        }}
      >
        <Alert
          onClose={() =>
            setSnackbarOpen(
              false
            )
          }
          severity={
            snackbarSeverity
          }
          variant="filled"
          sx={{
            width: "100%",
          }}
        >
          {
            snackbarMessage
          }
        </Alert>
      </Snackbar>
    </>
  );
}