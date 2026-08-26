"use client";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

import { Delete } from "@mui/icons-material";

import type {
  Restaurant,
} from "@/types/restaurant";

interface AdminDeleteDialogProps {
  open: boolean;
  restaurant: Restaurant | null;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function AdminDeleteDialog({
  open,
  restaurant,
  loading,
  onClose,
  onConfirm,
}: AdminDeleteDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
        }}
      >
        Delete Restaurant
      </DialogTitle>

      <DialogContent>
        <Typography>
          Are you sure you want to delete{" "}
          <strong>
            {restaurant?.name}
          </strong>
          ?
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress
                size={16}
                color="inherit"
              />
            ) : (
              <Delete />
            )
          }
        >
          {loading ? "Deleting..." : "Delete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}