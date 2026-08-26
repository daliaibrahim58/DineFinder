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

import { useLoginMutation } from "@/redux/api/authApi";

import { useAppDispatch } from "@/redux/hooks";

import {
  login as loginUser,
} from "@/redux/slices/authSlice";

export default function LoginForm() {
  const router =
    useRouter();

  const dispatch =
    useAppDispatch();

  const [
    login,
    {
      isLoading,
    },
  ] =
    useLoginMutation();

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const [error, setError] =
    useState("");

  // =====================================================
  // Handle Change
  // =====================================================

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,

      [event.target.name]:
        event.target.value,
    });
  };

  // =====================================================
  // Handle Submit
  // =====================================================

  const handleSubmit = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");

    try {
      const response =
        await login(
          form
        ).unwrap();

      console.log(
        "LOGIN RESPONSE:",
        response
      );

      if (
        response.success
      ) {
        const user = {
          ...response.data.user,

          role:
            response.data.user
              .role || "user",

          favorites:
            response.data.user
              .favorites || [],
        };

        const token =
          response.data.token;

        // =================================================
        // Redux
        // =================================================

        dispatch(
          loginUser({
            user,

            token,
          })
        );

        // =================================================
        // Local Storage
        // =================================================

        localStorage.setItem(
          "auth",
          JSON.stringify({
            user,

            token,
          })
        );

        // =================================================
        // Redirect
        // =================================================

        console.log(
          "USER ROLE:",
          user.role
        );

        if (
          user.role ===
          "admin"
        ) {
          router.push(
            "/admin"
          );
        } else {
          router.push(
            "/"
          );
        }
      }
    } catch (error: any) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      setError(
        error?.data
          ?.message ||
          "Invalid email or password"
      );
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Box
      sx={{
        minHeight:
          "100vh",

        width: "100%",

        display:
          "flex",

        alignItems:
          "center",

        justifyContent:
          "center",

        position:
          "relative",

        backgroundImage:
          "linear-gradient(rgba(0,0,0,0.48), rgba(0,0,0,0.48)), url('/images/auth-bg.jpg')",

        backgroundSize:
          "cover",

        backgroundPosition:
          "center",

        backgroundRepeat:
          "no-repeat",

        px: 2,

        py: 4,
      }}
    >
      {/* =================================================
          Background Overlay
      ================================================= */}

      <Box
        sx={{
          position:
            "absolute",

          inset: 0,

          background:
            "linear-gradient(135deg, rgba(232,93,4,0.12), rgba(0,0,0,0.15))",

          pointerEvents:
            "none",
        }}
      />

      <Container
        maxWidth="sm"
        sx={{
          position:
            "relative",

          zIndex: 1,

          display:
            "flex",

          justifyContent:
            "center",
        }}
      >
        <Paper
          elevation={12}
          sx={{
            width:
              "100%",

            maxWidth:
              460,

            p: {
              xs: 3,

              sm: 4,
            },

            borderRadius: 4,

            backgroundColor:
              "rgba(255,255,255,0.96)",

            backdropFilter:
              "blur(8px)",
          }}
        >
          {/* =================================================
              Logo / Brand
          ================================================= */}

          <Typography
            sx={{
              textAlign:
                "center",

              color:
                "#E85D04",

              fontWeight:
                900,

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
            sx={{
              fontWeight:
                800,

              textAlign:
                "center",

              mb: 1,
            }}
          >
            Welcome Back
          </Typography>

          <Typography
            color="text.secondary"
            align="center"
            sx={{
              mb: 4,

              lineHeight:
                1.6,
            }}
          >
            Login to your account
            and discover great
            restaurants.
          </Typography>

          {/* =================================================
              Error
          ================================================= */}

          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 2,

                borderRadius:
                  2,
              }}
            >
              {error}
            </Alert>
          )}

          {/* =================================================
              Form
          ================================================= */}

          <Box
            component="form"
            onSubmit={
              handleSubmit
            }
          >
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={
                form.email
              }
              onChange={
                handleChange
              }
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={
                form.password
              }
              onChange={
                handleChange
              }
              margin="normal"
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={
                isLoading
              }
              sx={{
                mt: 3,

                py: 1.5,

                borderRadius: 2,

                fontWeight:
                  700,

                backgroundColor:
                  "#E85D04",

                "&:hover": {
                  backgroundColor:
                    "#D94F00",
                },
              }}
            >
              {isLoading
                ? "Logging in..."
                : "Login"}
            </Button>
          </Box>

          {/* =================================================
              Signup
          ================================================= */}

          <Typography
            component="p"
            sx={{
              textAlign:
                "center",

              mt: 3,

              color:
                "#6B7280",
            }}
          >
            Don&apos;t have an
            account?{" "}
            <Link
              href="/signup"
              underline="hover"
              sx={{
                color:
                  "#E85D04",

                fontWeight:
                  700,
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}