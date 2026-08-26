"use client";

import { useEffect, useMemo, useState } from "react";

import { useRouter } from "next/navigation";

import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";

import { useAppSelector } from "@/redux/hooks";

import {
  useGetRestaurantsQuery,
  useDeleteRestaurantMutation,
} from "@/redux/api/restaurantApi";

import type { Restaurant } from "@/types/restaurant";

import AdminHeader from "@/components/admin/AdminHeader";
import AdminStats from "@/components/admin/AdminStats";
import AdminRestaurantTable from "@/components/admin/AdminRestaurantTable";
import AdminRestaurantForm from "@/components/admin/AdminRestaurantForm";
import AdminDeleteDialog from "@/components/admin/AdminDeleteDialog";

export default function AdminPage() {
  const router = useRouter();

  // =====================================================
  // Auth
  // =====================================================

  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  // =====================================================
  // Restaurant Form
  // =====================================================

  const [formOpen, setFormOpen] = useState(false);

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  // =====================================================
  // Delete
  // =====================================================

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [restaurantToDelete, setRestaurantToDelete] =
    useState<Restaurant | null>(null);

  // =====================================================
  // Restaurants
  // =====================================================

  const { data, isLoading, isFetching, isError, refetch } =
    useGetRestaurantsQuery({
      page: 1,
      limit: 100,
    });

  // =====================================================
  // Delete Mutation
  // =====================================================

  const [deleteRestaurant, { isLoading: isDeleting }] =
    useDeleteRestaurantMutation();

  // =====================================================
  // Data
  // =====================================================

  const restaurants = useMemo(() => data?.data || [], [data]);

  // =====================================================
  // Auth Guard
  // =====================================================

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
      return;
    }

    if (user?.role !== "admin") {
      router.replace("/");
    }
  }, [isAuthenticated, user, router]);

  // =====================================================
  // Prevent Admin UI from rendering
  // =====================================================

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role !== "admin") {
    return null;
  }

  // =====================================================
  // Add
  // =====================================================

  const handleAdd = () => {
    setSelectedRestaurant(null);

    setFormOpen(true);
  };

  // =====================================================
  // Edit
  // =====================================================

  const handleEdit = (restaurant: Restaurant) => {
    setSelectedRestaurant(restaurant);

    setFormOpen(true);
  };

  // =====================================================
  // Close Form
  // =====================================================

  const handleFormClose = () => {
    setFormOpen(false);

    setSelectedRestaurant(null);
  };

  // =====================================================
  // Form Success
  // =====================================================

  const handleFormSuccess = async () => {
    handleFormClose();

    await refetch();
  };

  // =====================================================
  // Open Delete Dialog
  // =====================================================

  const handleDelete = (restaurant: Restaurant) => {
    setRestaurantToDelete(restaurant);

    setDeleteDialogOpen(true);
  };

  // =====================================================
  // Close Delete Dialog
  // =====================================================

  const handleDeleteClose = () => {
    if (isDeleting) {
      return;
    }

    setDeleteDialogOpen(false);

    setRestaurantToDelete(null);
  };

  // =====================================================
  // Confirm Delete
  // =====================================================

  const handleConfirmDelete = async () => {
    if (!restaurantToDelete) {
      return;
    }

    try {
      await deleteRestaurant(restaurantToDelete._id).unwrap();

      handleDeleteClose();

      await refetch();
    } catch (error) {
      console.error("Delete restaurant error:", error);
    }
  };

  // =====================================================
  // UI
  // =====================================================

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

      <AdminHeader onAdd={handleAdd} />

      {/* =================================================
          Stats
      ================================================= */}

      <AdminStats
        totalRestaurants={data?.pagination?.totalRestaurants || 0}
        adminName={user?.name}
        isFetching={isFetching}
      />

      {/* =================================================
          Error
      ================================================= */}

      {isError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          Failed to load restaurants.
        </Alert>
      )}

      {/* =================================================
          Restaurants
      ================================================= */}

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress
            sx={{
              color: "#E85D04",
            }}
          />
        </Box>
      ) : (
        <AdminRestaurantTable
          restaurants={restaurants}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* =================================================
          Add / Edit Restaurant
      ================================================= */}

      <Dialog open={formOpen} onClose={handleFormClose} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{
            fontWeight: 800,
          }}
        >
          {selectedRestaurant ? "Edit Restaurant" : "Add Restaurant"}
        </DialogTitle>

        <DialogContent>
          <AdminRestaurantForm
            restaurant={selectedRestaurant}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </DialogContent>
      </Dialog>

      {/* =================================================
          Delete Restaurant
      ================================================= */}

      <AdminDeleteDialog
        open={deleteDialogOpen}
        restaurant={restaurantToDelete}
        loading={isDeleting}
        onClose={handleDeleteClose}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
}
