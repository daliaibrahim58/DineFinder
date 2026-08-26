"use client";

import { useState } from "react";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";

import {
  LocationOn,
  Close,
} from "@mui/icons-material";

interface Props {
  longitude: number;
  latitude: number;
  restaurantName: string;
}

export default function Directions({
  longitude,
  latitude,
  restaurantName,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Location Button */}

      <Box
        onClick={() => setOpen(true)}
        sx={{
          display: "inline-flex",
          alignItems: "center",
          gap: 1,
          cursor: "pointer",
          color: "text.secondary",
          "&:hover": {
            color: "#E85D04",
          },
        }}
      >
        <LocationOn />

        <Typography>
          View Location
        </Typography>
      </Box>

      {/* Map Dialog */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {restaurantName}

          <IconButton
            onClick={() => setOpen(false)}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          <Box
            sx={{
              width: "100%",
              height: 450,
            }}
          >
            <iframe
              title={`Location of ${restaurantName}`}
              width="100%"
              height="100%"
              style={{
                border: 0,
              }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${latitude},${longitude}&output=embed`}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}