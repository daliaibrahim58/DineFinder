/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  useState,
} from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";

import {
  useVerifyOTPMutation,
  useResendOTPMutation,
} from "@/redux/api/authApi";

export default function VerifyOTPForm() {
  const router = useRouter();

  const searchParams =
    useSearchParams();

  const email =
    searchParams.get("email") || "";

  const [
    verifyOTP,
    {
      isLoading: isVerifying,
    },
  ] = useVerifyOTPMutation();

  const [
    resendOTP,
    {
      isLoading: isResending,
    },
  ] = useResendOTPMutation();

  const [otp, setOtp] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const handleVerify = async (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");

    try {
      const response =
        await verifyOTP({
          email,
          otp,
        }).unwrap();

      if (response.success) {
        setMessage(
          "Email verified successfully!"
        );

        setTimeout(() => {
          router.push("/login");
        }, 1000);
      }
    } catch (error: any) {
      setError(
        error?.data?.message ||
          "Invalid or expired OTP"
      );
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");

    try {
      const response =
        await resendOTP({
          email,
        }).unwrap();

      if (response.success) {
        setMessage(
          "A new OTP has been sent to your email."
        );
      }
    } catch (error: any) {
      setError(
        error?.data?.message ||
          "Failed to resend OTP"
      );
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 4,
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 800,
              textAlign: "center",
              mb: 1,
            }}
          >
            Verify Your Email
          </Typography>

          <Typography
            color="text.secondary"
            component="p"
            sx={{
              textAlign: "center",
              mb: 3,
            }}
          >
            Enter the OTP sent to:
          </Typography>

          <Typography
            component="p"
            sx={{
              textAlign: "center",
              fontWeight: 700,
              mb: 3,
            }}
          >
            {email}
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 2 }}
            >
              {error}
            </Alert>
          )}

          {message && (
            <Alert
              severity="success"
              sx={{ mb: 2 }}
            >
              {message}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleVerify}
          >
            <TextField
              fullWidth
              label="OTP"
              value={otp}
              onChange={(event) =>
                setOtp(
                  event.target.value
                )
              }
              slotProps={{
                htmlInput: {
                  maxLength: 6,
                },
              }}
              required
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isVerifying}
              sx={{
                mt: 3,
                py: 1.5,
                backgroundColor:
                  "#E85D04",
                "&:hover": {
                  backgroundColor:
                    "#D94F00",
                },
              }}
            >
              {isVerifying
                ? "Verifying..."
                : "Verify Email"}
            </Button>
          </Box>

          <Button
            fullWidth
            onClick={handleResend}
            disabled={isResending}
            sx={{
              mt: 2,
              color: "#E85D04",
            }}
          >
            {isResending
              ? "Sending..."
              : "Resend OTP"}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}