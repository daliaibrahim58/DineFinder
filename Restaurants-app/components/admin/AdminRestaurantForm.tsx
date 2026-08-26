/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

import { Box, TextField, Button, Stack, CircularProgress } from "@mui/material";

import {
  useCreateRestaurantMutation,
  useUpdateRestaurantMutation,
} from "@/redux/api/restaurantApi";

import type { Restaurant } from "@/types/restaurant";

// =====================================================
// Props
// =====================================================

interface AdminRestaurantFormProps {
  restaurant: Restaurant | null;

  onSuccess: () => void;

  onCancel: () => void;
}

// =====================================================
// Form State
// =====================================================

interface FormState {
  name: string;

  description: string;

  image: string;

  cuisine: string;

  area: string;

  address: string;

  phone: string;

  price: string;

  openingTime: string;

  closingTime: string;

  longitude: string;

  latitude: string;
}

// =====================================================
// Create Initial Form
// =====================================================

const createInitialForm = (restaurant: Restaurant | null): FormState => {
  if (!restaurant) {
    return {
      name: "",
      description: "",
      image: "",
      cuisine: "",
      area: "",
      address: "",
      phone: "",
      price: "",
      openingTime: "",
      closingTime: "",
      longitude: "",
      latitude: "",
    };
  }

  return {
    name: restaurant.name || "",

    description: restaurant.description || "",

    image: restaurant.image || "",

    cuisine: restaurant.cuisine || "",

    area: restaurant.area || "",

    address: restaurant.address || "",

    phone: restaurant.phone || "",

    price: restaurant.price !== undefined ? String(restaurant.price) : "",

    openingTime: restaurant.openingTime || "",

    closingTime: restaurant.closingTime || "",

    longitude:
      restaurant.location?.coordinates?.[0] !== undefined
        ? String(restaurant.location.coordinates[0])
        : "",

    latitude:
      restaurant.location?.coordinates?.[1] !== undefined
        ? String(restaurant.location.coordinates[1])
        : "",
  };
};

// =====================================================
// Component
// =====================================================

export default function AdminRestaurantForm({
  restaurant,
  onSuccess,
  onCancel,
}: AdminRestaurantFormProps) {
  // =====================================================
  // Form
  // =====================================================

  const [form, setForm] = useState<FormState>(() =>
    createInitialForm(restaurant),
  );

  // =====================================================
  // Error
  // =====================================================

  const [error, setError] = useState("");

  // =====================================================
  // Create Mutation
  // =====================================================

  const [createRestaurant, { isLoading: isCreating }] =
    useCreateRestaurantMutation();

  // =====================================================
  // Update Mutation
  // =====================================================

  const [updateRestaurant, { isLoading: isUpdating }] =
    useUpdateRestaurantMutation();

  const isLoading = isCreating || isUpdating;

  // =====================================================
  // Change
  // =====================================================

  const handleChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setForm((previous) => ({
        ...previous,

        [field]: event.target.value,
      }));
    };

  // =====================================================
  // Submit
  // =====================================================

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");

    // =================================================
    // Validation
    // =================================================

    if (
      !form.name.trim() ||
      !form.cuisine.trim() ||
      !form.area.trim() ||
      !form.address.trim()
    ) {
      setError("Name, cuisine, area and address are required.");

      return;
    }

    // =================================================
    // Prepare Data
    // =================================================

    const restaurantData = {
      name: form.name.trim(),

      description: form.description.trim() || undefined,

      image: form.image.trim() || undefined,

      cuisine: form.cuisine.trim(),

      area: form.area.trim(),

      address: form.address.trim(),

      phone: form.phone.trim() || undefined,

      price: form.price.trim() ? Number(form.price) : undefined,

      openingTime: form.openingTime.trim() || undefined,

      closingTime: form.closingTime.trim() || undefined,

      location:
        form.longitude.trim() && form.latitude.trim()
          ? {
              type: "Point" as const,

              coordinates: [Number(form.longitude), Number(form.latitude)] as [
                number,
                number,
              ],
            }
          : undefined,
    };

    try {
      // =================================================
      // Update
      // =================================================

      if (restaurant) {
        await updateRestaurant({
          id: restaurant._id,

          data: restaurantData,
        }).unwrap();

        onSuccess();

        return;
      }

      // =================================================
      // Create
      // =================================================

      await createRestaurant(restaurantData).unwrap();

      onSuccess();
    } catch (error: any) {
      console.error("Restaurant save error:", error);

      setError(
        error?.data?.message ||
          error?.data?.error ||
          error?.message ||
          "Failed to save restaurant.",
      );
    }
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        pt: 1,
      }}
    >
      {/* =================================================
          Error
      ================================================= */}

      {error && (
        <Box
          sx={{
            mb: 2,

            p: 1.5,

            borderRadius: 2,

            backgroundColor: "#FEF2F2",

            color: "#B91C1C",
          }}
        >
          {error}
        </Box>
      )}

      <Stack spacing={2}>
        {/* =================================================
            Name
        ================================================= */}

        <TextField
          label="Restaurant Name"
          fullWidth
          required
          value={form.name}
          onChange={handleChange("name")}
        />

        {/* =================================================
            Description
        ================================================= */}

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={form.description}
          onChange={handleChange("description")}
        />

        {/* =================================================
            Image
        ================================================= */}

        <TextField
          label="Image URL"
          fullWidth
          value={form.image}
          onChange={handleChange("image")}
        />

        {/* =================================================
            Cuisine
        ================================================= */}

        <TextField
          label="Cuisine"
          fullWidth
          required
          value={form.cuisine}
          onChange={handleChange("cuisine")}
        />

        {/* =================================================
            Area
        ================================================= */}

        <TextField
          label="Area"
          fullWidth
          required
          value={form.area}
          onChange={handleChange("area")}
        />

        {/* =================================================
            Address
        ================================================= */}

        <TextField
          label="Address"
          fullWidth
          required
          value={form.address}
          onChange={handleChange("address")}
        />

        {/* =================================================
            Phone
        ================================================= */}

        <TextField
          label="Phone"
          fullWidth
          value={form.phone}
          onChange={handleChange("phone")}
        />

        {/* =================================================
            Price
        ================================================= */}

        <TextField
          label="Price"
          type="number"
          fullWidth
          value={form.price}
          onChange={handleChange("price")}
          slotProps={{
            htmlInput: {
              min: 0,
            },
          }}
        />

        {/* =================================================
            Opening / Closing
        ================================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },

            gap: 2,
          }}
        >
          <TextField
            label="Opening Time"
            type="time"
            fullWidth
            value={form.openingTime}
            onChange={handleChange("openingTime")}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            label="Closing Time"
            type="time"
            fullWidth
            value={form.closingTime}
            onChange={handleChange("closingTime")}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />
        </Box>

        {/* =================================================
            Coordinates
        ================================================= */}

        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },

            gap: 2,
          }}
        >
          <TextField
            label="Longitude"
            type="number"
            value={form.longitude}
            onChange={handleChange("longitude")}
          />

          <TextField
            label="Latitude"
            type="number"
            value={form.latitude}
            onChange={handleChange("latitude")}
          />
        </Box>

        {/* =================================================
            Actions
        ================================================= */}

        <Box
          sx={{
            display: "flex",

            justifyContent: "flex-end",

            gap: 1,

            pt: 2,
          }}
        >
          <Button type="button" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            startIcon={
              isLoading ? (
                <CircularProgress size={18} color="inherit" />
              ) : undefined
            }
            sx={{
              backgroundColor: "#E85D04",

              "&:hover": {
                backgroundColor: "#D94F00",
              },
            }}
          >
            {isLoading
              ? "Saving..."
              : restaurant
                ? "Update Restaurant"
                : "Create Restaurant"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
