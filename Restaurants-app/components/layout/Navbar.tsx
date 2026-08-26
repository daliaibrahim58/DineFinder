"use client";

import { useState } from "react";

import Link from "next/link";

import {
  AppBar,
  Toolbar,
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  Badge,
  Popover,
  Divider,
  Menu,
  MenuItem,
  Avatar,
  CardMedia,
  CircularProgress,
} from "@mui/material";

import {
  Favorite,
  FavoriteBorder,
  Restaurant,
  Menu as MenuIcon,
  Close,
} from "@mui/icons-material";

import { useAppSelector, useAppDispatch } from "@/redux/hooks";

import { logout, setUser } from "@/redux/slices/authSlice";

import { useGetRestaurantByIdQuery } from "@/redux/api/restaurantApi";

import { useRemoveFavoriteMutation } from "@/redux/api/favoriteApi";

// =====================================================
// Navbar
// =====================================================

export default function Navbar() {
  const dispatch = useAppDispatch();

  // =====================================================
  // Auth
  // =====================================================

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // =====================================================
  // Favorites
  // =====================================================

  const favorites = user?.favorites || [];

  // =====================================================
  // Desktop / Mobile Favorites Popover
  // =====================================================

  const [favoriteAnchor, setFavoriteAnchor] = useState<HTMLElement | null>(
    null,
  );

  const handleFavoriteClick = (event: React.MouseEvent<HTMLElement>) => {
    setFavoriteAnchor(event.currentTarget);
  };

  const handleFavoriteClose = () => {
    setFavoriteAnchor(null);
  };

  const isFavoriteOpen = Boolean(favoriteAnchor);

  // =====================================================
  // Desktop User Menu
  // =====================================================

  const [userAnchor, setUserAnchor] = useState<HTMLElement | null>(null);

  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchor(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchor(null);
  };

  // =====================================================
  // Mobile Menu
  // =====================================================

  const [mobileAnchor, setMobileAnchor] = useState<HTMLElement | null>(null);

  const handleMobileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMobileAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileAnchor(null);
  };

  const isMobileMenuOpen = Boolean(mobileAnchor);

  // =====================================================
  // Logout
  // =====================================================

  const handleLogout = () => {
    handleUserClose();

    handleMobileMenuClose();

    dispatch(logout());
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: "#FFFFFF",
        color: "#111827",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            minHeight: 72,

            display: "flex",

            justifyContent: "space-between",
          }}
        >
          {/* =================================================
              Logo
          ================================================= */}

          <Link
            href="/"
            style={{
              textDecoration: "none",

              color: "inherit",
            }}
          >
            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 1,
              }}
            >
              <Restaurant
                sx={{
                  color: "#E85D04",

                  fontSize: 32,
                }}
              />

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                }}
              >
                DineFinder
              </Typography>
            </Box>
          </Link>

          {/* =================================================
              Desktop Navigation
          ================================================= */}

          <Box
            sx={{
              display: {
                xs: "none",
                md: "flex",
              },

              alignItems: "center",

              gap: 1,
            }}
          >
            {/* =================================================
                Home
            ================================================= */}

            {user?.role === "user" && (
              <Button
                component={Link}
                href="/"
                sx={{
                  color: "#374151",
                }}
              >
                Home
              </Button>
            )}
            {/* =================================================
                Restaurants
            ================================================= */}

            {user?.role === "user" && (
              <Button
                component={Link}
                href="/restaurants"
                sx={{
                  color: "#374151",
                }}
              >
                Restaurants
              </Button>
            )}

            {/* =================================================
                Favorites
            ================================================= */}

            {isAuthenticated && user?.role === "user" && (
              <>
                <IconButton
                  onClick={handleFavoriteClick}
                  sx={{
                    color: "#374151",
                  }}
                >
                  <Badge badgeContent={favorites.length} color="error">
                    <FavoriteBorder />
                  </Badge>
                </IconButton>

                <FavoritePopover
                  open={isFavoriteOpen}
                  anchorEl={favoriteAnchor}
                  onClose={handleFavoriteClose}
                  favorites={favorites}
                  user={user}
                />
              </>
            )}

            {/* =================================================
                Admin
            ================================================= */}

            {isAuthenticated && user?.role === "admin" && (
              <Button
                component={Link}
                href="/admin"
                sx={{
                  color: "#374151",
                }}
              >
                Admin
              </Button>
            )}

            {/* =================================================
                Authentication
            ================================================= */}

            {isAuthenticated ? (
              <>
                {/* User Button */}

                <Button
                  onClick={handleUserClick}
                  sx={{
                    ml: 2,

                    color: "#111827",

                    fontWeight: 600,

                    textTransform: "none",

                    minWidth: "auto",

                    px: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 34,

                      height: 34,

                      mr: 1,

                      backgroundColor: "#E85D04",

                      fontSize: 16,

                      fontWeight: 700,
                    }}
                  >
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>

                  {user?.name}
                </Button>

                {/* User Menu */}

                <Menu
                  anchorEl={userAnchor}
                  open={Boolean(userAnchor)}
                  onClose={handleUserClose}
                  anchorOrigin={{
                    vertical: "bottom",

                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",

                    horizontal: "right",
                  }}
                  slotProps={{
                    paper: {
                      sx: {
                        mt: 1,

                        minWidth: 180,

                        borderRadius: 2,

                        boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                      },
                    },
                  }}
                >
                  {/* User Info */}

                  <Box
                    sx={{
                      px: 2,

                      py: 1.5,
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                      }}
                    >
                      {user?.name}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </Box>

                  <Divider />

                  {/* Logout */}

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      color: "#E85D04",

                      fontWeight: 600,
                    }}
                  >
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                component={Link}
                href="/login"
                variant="contained"
                sx={{
                  ml: 2,

                  backgroundColor: "#E85D04",

                  "&:hover": {
                    backgroundColor: "#D94F00",
                  },
                }}
              >
                Login
              </Button>
            )}
          </Box>

          {/* =================================================
              Mobile Navigation
          ================================================= */}

          <Box
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },

              alignItems: "center",

              gap: 0.5,
            }}
          >
            {/* =================================================
                Mobile Favorites
            ================================================= */}

            {isAuthenticated && user?.role === "user" && (
              <>
                <IconButton
                  onClick={handleFavoriteClick}
                  sx={{
                    color: "#374151",
                  }}
                >
                  <Badge badgeContent={favorites.length} color="error">
                    <FavoriteBorder />
                  </Badge>
                </IconButton>

                <FavoritePopover
                  open={isFavoriteOpen}
                  anchorEl={favoriteAnchor}
                  onClose={handleFavoriteClose}
                  favorites={favorites}
                  user={user}
                />
              </>
            )}

            {/* =================================================
                Mobile Menu
            ================================================= */}

            <IconButton
              onClick={handleMobileMenuClick}
              sx={{
                color: "#374151",
              }}
              aria-label="Open navigation menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>

          {/* =================================================
              Mobile Menu Popup
          ================================================= */}

          <Menu
            anchorEl={mobileAnchor}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
            anchorOrigin={{
              vertical: "bottom",

              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",

              horizontal: "right",
            }}
            slotProps={{
              paper: {
                sx: {
                  mt: 1,

                  minWidth: 200,

                  borderRadius: 2,

                  boxShadow: "0 8px 25px rgba(0,0,0,0.12)",
                },
              },
            }}
          >
            {/* =================================================
                Home
            ================================================= */}

            {user?.role === "user" && (
              <MenuItem
                component={Link}
                href="/"
                onClick={handleMobileMenuClose}
              >
                Home
              </MenuItem>
            )}

            {/* =================================================
                Restaurants
            ================================================= */}

            {user?.role === "user" && (
              <MenuItem
                component={Link}
                href="/restaurants"
                onClick={handleMobileMenuClose}
              >
                Restaurants
              </MenuItem>
            )}

            {/* =================================================
                Admin
            ================================================= */}

            {isAuthenticated && user?.role === "admin" && (
              <MenuItem
                component={Link}
                href="/admin"
                onClick={handleMobileMenuClose}
              >
                Admin
              </MenuItem>
            )}

            <Divider />

            {/* =================================================
                Auth
            ================================================= */}

            {isAuthenticated ? (
              <>
                <Box
                  sx={{
                    px: 2,

                    py: 1.5,
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                    }}
                  >
                    {user?.name}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>

                <MenuItem
                  onClick={handleLogout}
                  sx={{
                    color: "#E85D04",

                    fontWeight: 600,
                  }}
                >
                  Logout
                </MenuItem>
              </>
            ) : (
              <MenuItem
                component={Link}
                href="/login"
                onClick={handleMobileMenuClose}
                sx={{
                  color: "#E85D04",

                  fontWeight: 600,
                }}
              >
                Login
              </MenuItem>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// =========================================================
// Favorites Popover
// =========================================================

interface FavoritePopoverProps {
  open: boolean;

  anchorEl: HTMLElement | null;

  onClose: () => void;

  favorites: string[];

  user: {
    id: string;

    name: string;

    email: string;

    role?: "user" | "admin";

    favorites: string[];
  } | null;
}

function FavoritePopover({
  open,
  anchorEl,
  onClose,
  favorites,
  user,
}: FavoritePopoverProps) {
  return (
    <Popover
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",

        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",

        horizontal: "right",
      }}
      slotProps={{
        paper: {
          sx: {
            mt: 1,

            borderRadius: 2,
          },
        },
      }}
    >
      <Box
        sx={{
          width: {
            xs: 320,

            sm: 360,
          },

          maxHeight: 450,

          overflowY: "auto",

          p: 2,
        }}
      >
        {/* =================================================
            Header
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            alignItems: "center",

            justifyContent: "space-between",

            mb: 1,
          }}
        >
          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              gap: 1,
            }}
          >
            <Favorite
              sx={{
                color: "#E85D04",

                fontSize: 22,
              }}
            />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Favorites
            </Typography>
          </Box>

          <IconButton size="small" onClick={onClose}>
            <Close fontSize="small" />
          </IconButton>
        </Box>

        <Divider />

        {/* =================================================
            Empty
        ================================================= */}

        {favorites.length === 0 ? (
          <Box
            sx={{
              py: 4,

              textAlign: "center",
            }}
          >
            <FavoriteBorder
              sx={{
                fontSize: 40,

                color: "#9CA3AF",

                mb: 1,
              }}
            />

            <Typography variant="body2" color="text.secondary">
              No favorite restaurants yet.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              mt: 1,

              display: "flex",

              flexDirection: "column",

              gap: 1,
            }}
          >
            {favorites.map((restaurantId) => (
              <FavoriteRestaurant
                key={restaurantId}
                restaurantId={restaurantId}
                user={user}
                onClose={onClose}
              />
            ))}
          </Box>
        )}
      </Box>
    </Popover>
  );
}

// =========================================================
// Favorite Restaurant
// =========================================================

interface FavoriteRestaurantProps {
  restaurantId: string;

  user: {
    id: string;

    name: string;

    email: string;

    role?: "user" | "admin";

    favorites: string[];
  } | null;

  onClose: () => void;
}

function FavoriteRestaurant({
  restaurantId,
  user,
  onClose,
}: FavoriteRestaurantProps) {
  const dispatch = useAppDispatch();

  // =====================================================
  // Restaurant
  // =====================================================

  const { data, isLoading, isError } = useGetRestaurantByIdQuery(restaurantId);

  // =====================================================
  // Remove Favorite
  // =====================================================

  const [removeFavorite, { isLoading: isRemoving }] =
    useRemoveFavoriteMutation();

  // =====================================================
  // Remove Handler
  // =====================================================

  const handleRemoveFavorite = async (event: React.MouseEvent) => {
    event.preventDefault();

    event.stopPropagation();

    if (!user || isRemoving) {
      return;
    }

    try {
      const response = await removeFavorite(restaurantId).unwrap();

      dispatch(
        setUser({
          ...user,

          favorites: response.data.favorites.map((id) => id.toString()),
        }),
      );
    } catch (error) {
      console.error("Remove Favorite Error:", error);
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          py: 2,
        }}
      >
        <CircularProgress
          size={22}
          sx={{
            color: "#E85D04",
          }}
        />
      </Box>
    );
  }

  // =====================================================
  // Error
  // =====================================================

  if (isError || !data?.data) {
    return null;
  }

  const restaurant = data.data;

  // =====================================================
  // Render
  // =====================================================

  return (
    <Box
      sx={{
        display: "flex",

        gap: 1.5,

        p: 1,

        borderRadius: 2,

        transition: "all 0.2s ease",

        "&:hover": {
          backgroundColor: "#F9FAFB",
        },
      }}
    >
      {/* =================================================
          Restaurant Link
      ================================================= */}

      <Box
        component={Link}
        href={`/restaurants/${restaurant._id}`}
        onClick={onClose}
        sx={{
          display: "flex",

          gap: 1.5,

          flex: 1,

          minWidth: 0,

          textDecoration: "none",

          color: "inherit",
        }}
      >
        {/* Image */}

        <CardMedia
          component="img"
          image={restaurant.image || "/images/restaurant-placeholder.jpg"}
          alt={restaurant.name}
          sx={{
            width: 75,

            height: 75,

            borderRadius: 2,

            objectFit: "cover",

            flexShrink: 0,
          }}
        />

        {/* Content */}

        <Box
          sx={{
            minWidth: 0,

            flex: 1,
          }}
        >
          <Typography
            variant="subtitle1"
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

              mt: 0.3,

              overflow: "hidden",

              textOverflow: "ellipsis",

              whiteSpace: "nowrap",
            }}
          >
            {restaurant.cuisine || "Restaurant"}

            {restaurant.area && ` • ${restaurant.area}`}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              display: "-webkit-box",

              mt: 0.3,

              fontSize: "0.68rem",

              lineHeight: 1.35,

              overflow: "hidden",

              WebkitBoxOrient: "vertical",

              WebkitLineClamp: 2,
            }}
          >
            {restaurant.description || "No description available."}
          </Typography>
        </Box>
      </Box>

      {/* =================================================
          Remove
      ================================================= */}

      <IconButton
        onClick={handleRemoveFavorite}
        disabled={isRemoving}
        size="small"
        sx={{
          alignSelf: "flex-start",

          color: "#E85D04",

          flexShrink: 0,
        }}
      >
        {isRemoving ? (
          <CircularProgress
            size={18}
            sx={{
              color: "#E85D04",
            }}
          />
        ) : (
          <Favorite />
        )}
      </IconButton>
    </Box>
  );
}
