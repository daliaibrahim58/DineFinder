/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
  Link,
} from "@mui/material";

import { useRegisterMutation } from "@/redux/api/authApi";

export default function SignupForm() {
  const router = useRouter();

  const [register, { isLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  // =====================================================
  // Handle Change
  // =====================================================

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,

      [event.target.name]: event.target.value,
    });
  };

  // =====================================================
  // Handle Submit
  // =====================================================

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setError("");

    try {
      const response = await register(form).unwrap();

      console.log("REGISTER RESPONSE:", response);

      if (response.success) {
        router.push(`/verify-otp?email=${encodeURIComponent(form.email)}`);
      }
    } catch (error: any) {
      console.error("REGISTER ERROR:", error);

      setError(error?.data?.message || "Registration failed");
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",

        width: "100%",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        position: "relative",

        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.48), rgba(0,0,0,0.48)), url('/images/auth-bg.jpg')",

        backgroundSize: "cover",

        backgroundPosition: "center",

        backgroundRepeat: "no-repeat",

        px: 2,

        py: 4,
      }}
    >
      {/* =================================================
          Overlay
      ================================================= */}

      <Box
        sx={{
          position: "absolute",

          inset: 0,

          background:
            "linear-gradient(135deg, rgba(232,93,4,0.12), rgba(0,0,0,0.15))",

          pointerEvents: "none",
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          position: "relative",

          zIndex: 1,

          display: "flex",

          justifyContent: "center",
        }}
      >
        <Paper
          elevation={12}
          sx={{
            width: "100%",

            maxWidth: 460,

            p: {
              xs: 3,

              sm: 4,
            },

            borderRadius: 4,

            backgroundColor: "rgba(255,255,255,0.96)",

            backdropFilter: "blur(8px)",
          }}
        >
          {/* =================================================
              Brand
          ================================================= */}

          <Typography
            sx={{
              textAlign: "center",

              color: "#E85D04",

              fontWeight: 900,

              fontSize: 18,

              mb: 1,
            }}
          >
            DineFinder
          </Typography>

          {/* =================================================
              Title
          ================================================= */}

          <Typography
            variant="h4"
            align="center"
            sx={{
              fontWeight: 800,

              mb: 1,
            }}
          >
            Create Account
          </Typography>

          <Typography
            color="text.secondary"
            align="center"
            sx={{
              mb: 4,

              lineHeight: 1.6,
            }}
          >
            Sign up to discover amazing restaurants.
          </Typography>

          {/* =================================================
              Error
          ================================================= */}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,

                borderRadius: 2,
              }}
            >
              {error}
            </Alert>
          )}

          {/* =================================================
              Form
          ================================================= */}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Name */}

            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              required
            />

            {/* Email */}

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            {/* Password */}

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            {/* Submit */}

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 3,

                py: 1.5,

                borderRadius: 2,

                fontWeight: 700,

                backgroundColor: "#E85D04",

                "&:hover": {
                  backgroundColor: "#D94F00",
                },
              }}
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </Box>

          {/* =================================================
              Login
          ================================================= */}

          <Typography
            align="center"
            sx={{
              mt: 3,

              color: "#6B7280",
            }}
          >
            Already have an account?{" "}
            <Link
              href="/login"
              underline="hover"
              sx={{
                color: "#E85D04",

                fontWeight: 700,
              }}
            >
              Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}
