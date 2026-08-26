/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useEffect, useRef, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import LocationOnIcon from "@mui/icons-material/LocationOn";

import { useRagSearchMutation } from "@/redux/api/restaurantApi";

import { useAppDispatch } from "@/redux/hooks";

import { setFilters } from "@/redux/slices/filterSlice";

import { setRagResults } from "@/redux/slices/ragSlice";

import type { RagRestaurant, RagFilters } from "@/types/restaurant";

// =====================================================
// Types
// =====================================================

interface UserLocation {
  latitude: number;

  longitude: number;
}

// =====================================================
// Component
// =====================================================

export default function SearchBar() {
  const dispatch = useAppDispatch();

  const router = useRouter();

  // =====================================================
  // RAG API
  // =====================================================

  const [ragSearch, { isLoading: isRagSearching }] = useRagSearchMutation();

  // =====================================================
  // Search
  // =====================================================

  const [search, setSearch] = useState("");

  // =====================================================
  // Dropdown
  // =====================================================

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // =====================================================
  // RAG Answer
  // =====================================================

  const [ragAnswer, setRagAnswer] = useState("");

  // =====================================================
  // RAG Restaurants
  // =====================================================

  const [ragRestaurants, setRagRestaurants] = useState<RagRestaurant[]>([]);

  // =====================================================
  // RAG Filters
  // =====================================================

  const [ragFilters, setRagFilters] = useState<RagFilters | null>(null);

  // =====================================================
  // Processed Search
  // =====================================================

  const [processedSearch, setProcessedSearch] = useState("");

  // =====================================================
  // Search Message
  // =====================================================

  const [searchMessage, setSearchMessage] = useState("");

  // =====================================================
  // User Location
  // =====================================================

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  // =====================================================
  // Location Dialog
  // =====================================================

  const [locationDialogOpen, setLocationDialogOpen] = useState(false);

  const [locationError, setLocationError] = useState("");

  // =====================================================
  // Refs
  // =====================================================

  const searchRequestId = useRef(0);

  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // =====================================================
  // Nearby Search
  // =====================================================

  const isNearbySearch = ragFilters?.sort === "distance";

  // =====================================================
  // Open Dropdown
  // =====================================================

  const openDropdown = () => {
    if (search.trim()) {
      setIsDropdownOpen(true);
    }
  };

  // =====================================================
  // Close Dropdown Outside
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // =====================================================
  // Handle Input Change
  // =====================================================

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSearch(value);

    // ===================================================
    // Open / Close Dropdown
    // ===================================================

    setIsDropdownOpen(value.trim().length > 0);

    // ===================================================
    // Reset Previous RAG Result
    // ===================================================

    setProcessedSearch("");

    setRagAnswer("");

    setRagRestaurants([]);

    setRagFilters(null);

    setSearchMessage("");

    setUserLocation(null);

    // ===================================================
    // Empty Search
    // ===================================================

    if (!value.trim()) {
      setIsDropdownOpen(false);
    }
  };

  // =====================================================
  // RAG Search Effect
  // =====================================================

  useEffect(() => {
    const value = search.trim();

    // =====================================================
    // Empty Search
    // =====================================================

    if (!value) {
      return;
    }

    // =====================================================
    // Request ID
    // =====================================================

    const requestId = ++searchRequestId.current;

    // =====================================================
    // Debounce
    // =====================================================

    const timeout = setTimeout(async () => {
      try {
        console.log("=================================");

        console.log("RAG SEARCH QUERY:", value);

        console.log("=================================");

        // =============================================
        // RAG Request
        // =============================================

        const result = await ragSearch({
          query: value,

          limit: 5,
        }).unwrap();

        // =============================================
        // Ignore Old Response
        // =============================================

        if (requestId !== searchRequestId.current) {
          return;
        }

        console.log("RAG SEARCH RESPONSE:", result);

        // =============================================
        // Invalid Response
        // =============================================

        if (!result?.data) {
          setRagAnswer("");

          setRagRestaurants([]);

          setRagFilters(null);

          setProcessedSearch(value);

          setSearchMessage(
            "I couldn't find relevant restaurants. Try describing the cuisine, area, rating, or type of place.",
          );

          return;
        }

        // =============================================
        // Save Answer
        // =============================================

        setRagAnswer(result.data.answer || "");

        // =============================================
        // Save Restaurants
        // =============================================

        setRagRestaurants(
          Array.isArray(result.data.restaurants) ? result.data.restaurants : [],
        );

        // =============================================
        // Save Filters
        // =============================================

        setRagFilters(result.data.filters || null);

        // =============================================
        // Mark Processed
        // =============================================

        setProcessedSearch(value);

        // =============================================
        // No Useful Result
        // =============================================

        const restaurants = Array.isArray(result.data.restaurants)
          ? result.data.restaurants
          : [];

        const answer = result.data.answer || "";

        if (restaurants.length === 0 && !answer) {
          setSearchMessage(
            "I couldn't find relevant restaurants. Try another search.",
          );
        } else {
          setSearchMessage("");
        }
      } catch (error: any) {
        // =============================================
        // Ignore Old Request
        // =============================================

        if (requestId !== searchRequestId.current) {
          return;
        }

        // =============================================
        // Handle Error Silently
        // =============================================

        console.log(
          "RAG search handled:",
          error?.data?.message || error?.message || "No matching results",
        );

        // =============================================
        // Reset Results
        // =============================================

        setRagAnswer("");

        setRagRestaurants([]);

        setRagFilters(null);

        // =============================================
        // Mark Processed
        // =============================================

        setProcessedSearch(value);

        // =============================================
        // User Friendly Message
        // =============================================

        setSearchMessage(
          'I couldn\'t understand that search. Try something like "Japanese restaurants in Zamalek" or "a quiet romantic place".',
        );
      }
    }, 800);

    // =====================================================
    // Cleanup
    // =====================================================

    return () => {
      clearTimeout(timeout);
    };
  }, [search, ragSearch]);

  // =====================================================
  // Get User Location
  // =====================================================

  const getUserLocation = (): Promise<UserLocation> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser."));

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,

            longitude: position.coords.longitude,
          });
        },

        (error) => {
          reject(error);
        },

        {
          enableHighAccuracy: true,

          timeout: 10000,

          maximumAge: 0,
        },
      );
    });
  };

  // =====================================================
  // Request Location
  // =====================================================

  const requestLocation = async () => {
    try {
      setLocationError("");

      const location = await getUserLocation();

      setUserLocation(location);

      setLocationDialogOpen(false);
    } catch (error: any) {
      console.log("LOCATION ERROR:", error);

      let message =
        "We couldn't access your location. Please allow location access from your browser.";

      if (error?.code === 1) {
        message =
          "Location permission was denied. Please allow location access to find restaurants near you.";
      }

      if (error?.code === 2) {
        message = "Your location could not be determined. Please try again.";
      }

      if (error?.code === 3) {
        message = "Location request timed out. Please try again.";
      }

      setLocationError(message);
    }
  };

  // =====================================================
  // Close Location Dialog
  // =====================================================

  const handleCloseLocationDialog = () => {
    setLocationDialogOpen(false);

    setLocationError("");
  };

  // =====================================================
  // Save RAG Results
  // =====================================================

  const saveRagResults = () => {
    if (!ragFilters) {
      return;
    }

    dispatch(
      setRagResults({
        query: search.trim(),

        answer: ragAnswer,

        restaurants: ragRestaurants,

        filters: ragFilters,
      }),
    );
  };

  // =====================================================
  // Save Normal Filters
  // =====================================================

  const saveNormalFilters = () => {
    if (!ragFilters) {
      return;
    }

    dispatch(
      setFilters({
        search: ragFilters.search || "",

        cuisine: ragFilters.cuisine || "",

        area: ragFilters.area || "",

        minPrice: ragFilters.minPrice ?? null,

        maxPrice: ragFilters.maxPrice ?? null,

        minRating: ragFilters.minRating ?? null,

        sort: ragFilters.sort || "rating_desc",

        page: 1,

        limit: 10,
      }),
    );
  };

  // =====================================================
  // Handle Search
  // =====================================================

  const handleSearch = () => {
    const value = search.trim();

    // ===================================================
    // Empty Search
    // ===================================================

    if (!value) {
      return;
    }

    // ===================================================
    // RAG Not Ready
    // ===================================================

    if (processedSearch !== value || !ragFilters) {
      return;
    }

    // ===================================================
    // Save RAG
    // ===================================================

    saveRagResults();

    // ===================================================
    // Nearby
    // ===================================================

    if (ragFilters.sort === "distance") {
      if (!userLocation) {
        setLocationDialogOpen(true);

        return;
      }
    }

    // ===================================================
    // Save Filters
    // ===================================================

    saveNormalFilters();

    // ===================================================
    // Close Dropdown
    // ===================================================

    setIsDropdownOpen(false);

    // ===================================================
    // Navigate
    // ===================================================

    router.push("/restaurants");
  };

  // =====================================================
  // Enter Key
  // =====================================================

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();

      handleSearch();
    }
  };

  // =====================================================
  // Search Disabled
  // =====================================================

  const isSearchDisabled: boolean =
    Boolean(isRagSearching) ||
    search.trim().length === 0 ||
    processedSearch !== search.trim();

  // =====================================================
  // Render AI Recommendation
  // =====================================================

  const renderAIAnswer = () => {
    if (!ragAnswer) {
      return null;
    }

    const lines = ragAnswer
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    return (
      <Box
        sx={{
          p: 2.5,

          background: "linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 100%)",

          borderBottom: "1px solid #F1F5F9",
        }}
      >
        {/* =================================================
              Header
          ================================================= */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            gap: 1.2,

            mb: 1.5,
          }}
        >
          <Box
            sx={{
              width: 36,

              height: 36,

              borderRadius: "50%",

              backgroundColor: "#E85D04",

              color: "#FFFFFF",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              fontSize: 12,

              fontWeight: 800,

              flexShrink: 0,
            }}
          >
            AI
          </Box>

          <Box>
            <Typography
              sx={{
                fontWeight: 800,

                fontSize: 15,

                color: "#111827",
              }}
            >
              AI Recommendation
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Based on your search
            </Typography>
          </Box>
        </Box>

        {/* =================================================
              Answer Box
          ================================================= */}

        <Box
          sx={{
            backgroundColor: "#FFFFFF",

            border: "1px solid #F1F5F9",

            borderRadius: 2.5,

            p: 2,
          }}
        >
          {lines.map((line, index) => {
            const cleanLine = line.replace(/\*\*/g, "").trim();

            // ==========================================
            // Numbered Restaurant
            // ==========================================

            if (/^\d+\./.test(cleanLine)) {
              return (
                <Box
                  key={index}
                  sx={{
                    mt: index === 0 ? 0 : 2,

                    mb: 0.8,

                    p: 1.2,

                    borderRadius: 2,

                    backgroundColor: "#FFF7ED",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,

                      color: "#111827",

                      fontSize: 14,

                      lineHeight: 1.6,
                    }}
                  >
                    {cleanLine}
                  </Typography>
                </Box>
              );
            }

            // ==========================================
            // Bullet
            // ==========================================

            if (cleanLine.startsWith("-")) {
              const text = cleanLine.replace(/^-\s*/, "").trim();

              const separatorIndex = text.indexOf(":");

              if (separatorIndex !== -1) {
                const label = text.slice(0, separatorIndex).trim();

                const value = text.slice(separatorIndex + 1).trim();

                return (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",

                      gap: 0.7,

                      alignItems: "flex-start",

                      mb: 0.5,

                      pl: 1,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#E85D04",

                        fontWeight: 800,

                        lineHeight: 1.7,
                      }}
                    >
                      •
                    </Typography>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "#374151",

                        lineHeight: 1.7,
                      }}
                    >
                      <strong>{label}:</strong> {value}
                    </Typography>
                  </Box>
                );
              }

              return (
                <Typography
                  key={index}
                  variant="body2"
                  sx={{
                    color: "#374151",

                    lineHeight: 1.7,

                    mb: 0.5,

                    pl: 1,
                  }}
                >
                  • {text}
                </Typography>
              );
            }

            // ==========================================
            // Normal Text
            // ==========================================

            return (
              <Typography
                key={index}
                variant="body2"
                sx={{
                  color: "#374151",

                  lineHeight: 1.8,

                  mb: 0.7,
                }}
              >
                {cleanLine}
              </Typography>
            );
          })}
        </Box>
      </Box>
    );
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <Box
      ref={searchContainerRef}
      sx={{
        position: "relative",

        maxWidth: 700,

        mx: "auto",

        width: "100%",
      }}
    >
      {/* =================================================
          Search Box
      ================================================= */}

      <Box
        sx={{
          display: "flex",

          gap: 1,

          backgroundColor: "#FFFFFF",

          p: 1,

          borderRadius: 3,

          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <TextField
          fullWidth
          value={search}
          onChange={handleChange}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          placeholder="Search restaurants..."
          variant="outlined"
          size="medium"
          autoComplete="off"
          sx={{
            "& .MuiOutlinedInput-root": {
              border: "none",

              "& fieldset": {
                border: "none",
              },
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={isSearchDisabled}
          startIcon={
            isRagSearching ? (
              <CircularProgress
                size={18}
                sx={{
                  color: "#FFFFFF",
                }}
              />
            ) : (
              <SearchIcon />
            )
          }
          sx={{
            minWidth: 120,

            borderRadius: 2,

            backgroundColor: "#E85D04",

            "&:hover": {
              backgroundColor: "#D94F00",
            },
          }}
        >
          {isRagSearching ? "Searching..." : "Search"}
        </Button>
      </Box>

      {/* =================================================
          Dropdown
      ================================================= */}

      {isDropdownOpen && search.trim().length > 0 && (
        <Paper
          elevation={8}
          sx={{
            position: "absolute",

            top: "calc(100% + 8px)",

            left: 0,

            right: 0,

            zIndex: 1000,

            borderRadius: 3,

            overflow: "hidden",

            maxHeight: 550,

            overflowY: "auto",
          }}
        >
          {/* =================================================
                Loading
            ================================================= */}

          {isRagSearching && (
            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                justifyContent: "center",

                gap: 1,

                py: 4,
              }}
            >
              <CircularProgress
                size={22}
                sx={{
                  color: "#E85D04",
                }}
              />

              <Typography color="text.secondary">
                Finding the best restaurants...
              </Typography>
            </Box>
          )}

          {/* =================================================
                Friendly Message
            ================================================= */}

          {!isRagSearching &&
            processedSearch === search.trim() &&
            searchMessage && (
              <Box
                sx={{
                  py: 4,

                  px: 3,

                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,

                    color: "#374151",

                    mb: 0.8,
                  }}
                >
                  No relevant results
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.7,
                  }}
                >
                  {searchMessage}
                </Typography>
              </Box>
            )}

          {/* =================================================
                AI Recommendation
            ================================================= */}

          {!isRagSearching &&
            processedSearch === search.trim() &&
            ragAnswer &&
            !searchMessage &&
            renderAIAnswer()}

          {/* =================================================
                Divider
            ================================================= */}

          {!isRagSearching && ragAnswer && ragRestaurants.length > 0 && (
            <Divider />
          )}

          {/* =================================================
                Nearby
            ================================================= */}

          {!isRagSearching &&
            processedSearch === search.trim() &&
            ragFilters &&
            isNearbySearch &&
            !userLocation && (
              <Box
                sx={{
                  py: 3,

                  px: 2,

                  textAlign: "center",
                }}
              >
                <LocationOnIcon
                  sx={{
                    fontSize: 40,

                    color: "#E85D04",
                  }}
                />

                <Typography
                  sx={{
                    fontWeight: 700,

                    mt: 1,
                  }}
                >
                  Find restaurants near you
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,

                    mb: 2,
                  }}
                >
                  We need your location to find restaurants closest to you.
                </Typography>

                <Button
                  variant="contained"
                  onClick={() => setLocationDialogOpen(true)}
                  startIcon={<LocationOnIcon />}
                  sx={{
                    backgroundColor: "#E85D04",

                    "&:hover": {
                      backgroundColor: "#D94F00",
                    },
                  }}
                >
                  Allow Location
                </Button>
              </Box>
            )}

          {/* =================================================
                Restaurants
            ================================================= */}

          {!isRagSearching &&
            processedSearch === search.trim() &&
            !searchMessage &&
            ragRestaurants.length > 0 && (
              <Box>
                {ragRestaurants.map((restaurant, index) => (
                  <Box key={restaurant._id}>
                    <Link
                      href={`/restaurants/${restaurant._id}`}
                      style={{
                        textDecoration: "none",

                        color: "inherit",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",

                          alignItems: "center",

                          gap: 2,

                          p: 2,

                          cursor: "pointer",

                          transition: "background-color 0.2s",

                          "&:hover": {
                            backgroundColor: "#FFF7ED",
                          },
                        }}
                      >
                        {/* Image */}

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

                        {/* Info */}

                        <Box
                          sx={{
                            minWidth: 0,

                            flex: 1,
                          }}
                        >
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
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mt: 0.3,

                              overflow: "hidden",

                              textOverflow: "ellipsis",

                              whiteSpace: "nowrap",
                            }}
                          >
                            {restaurant.cuisine || "Restaurant"}
                          </Typography>

                          <Box
                            sx={{
                              display: "flex",

                              alignItems: "center",

                              gap: 0.5,

                              mt: 0.3,
                            }}
                          >
                            <LocationOnIcon
                              sx={{
                                fontSize: 15,

                                color: "#E85D04",
                              }}
                            />

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {restaurant.area || "Location unavailable"}
                            </Typography>
                          </Box>
                        </Box>

                        {/* Rating */}

                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: 700,

                            color: "#E85D04",

                            flexShrink: 0,
                          }}
                        >
                          ★{" "}
                          {typeof restaurant.rating === "number"
                            ? restaurant.rating.toFixed(1)
                            : "0.0"}
                        </Typography>
                      </Box>
                    </Link>

                    {index < ragRestaurants.length - 1 && <Divider />}
                  </Box>
                ))}

                {/* =================================================
                      View All
                  ================================================= */}

                <Box
                  sx={{
                    borderTop: "1px solid #eee",

                    p: 1.5,

                    textAlign: "center",
                  }}
                >
                  <Button
                    onClick={handleSearch}
                    disabled={isSearchDisabled}
                    sx={{
                      color: "#E85D04",

                      fontWeight: 700,

                      "&:hover": {
                        backgroundColor: "#FFF7ED",
                      },
                    }}
                  >
                    View all results
                  </Button>
                </Box>
              </Box>
            )}

          {/* =================================================
                Empty
            ================================================= */}

          {!isRagSearching &&
            processedSearch === search.trim() &&
            !searchMessage &&
            !ragAnswer &&
            ragRestaurants.length === 0 && (
              <Box
                sx={{
                  py: 4,

                  px: 2,

                  textAlign: "center",
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                  }}
                >
                  No restaurants found
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    mt: 0.5,
                  }}
                >
                  Try another restaurant name or cuisine.
                </Typography>
              </Box>
            )}
        </Paper>
      )}

      {/* =====================================================
          Location Dialog
      ===================================================== */}

      <Dialog
        open={locationDialogOpen}
        onClose={handleCloseLocationDialog}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 1,
            }}
          >
            <LocationOnIcon
              sx={{
                color: "#E85D04",
              }}
            />
            Allow Location Access
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            To find restaurants near you, we need access to your current
            location.
          </Typography>

          {locationError && (
            <Typography
              color="error"
              sx={{
                mt: 2,
              }}
            >
              {locationError}
            </Typography>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: 2,
          }}
        >
          <Button
            onClick={handleCloseLocationDialog}
            sx={{
              color: "#666",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={requestLocation}
            startIcon={<LocationOnIcon />}
            sx={{
              backgroundColor: "#E85D04",

              "&:hover": {
                backgroundColor: "#D94F00",
              },
            }}
          >
            Allow Location
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
