import { apiSlice } from "../apiSlice";

import type { User } from "../slices/authSlice";

// =====================================================
// Register
// =====================================================

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
}

// =====================================================
// Login
// =====================================================

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;

  data: {
    user: User;
    token: string;
  };
}

// =====================================================
// Verify OTP
// =====================================================

interface VerifyOTPRequest {
  email: string;
  otp: string;
}

interface VerifyOTPResponse {
  success: boolean;
  message: string;
}

// =====================================================
// Resend OTP
// =====================================================

interface ResendOTPRequest {
  email: string;
}

interface ResendOTPResponse {
  success: boolean;
  message: string;
}

// =====================================================
// API
// =====================================================

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =============================================
    // Register
    // =============================================

    register: builder.mutation<
      RegisterResponse,
      RegisterRequest
    >({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),

    // =============================================
    // Login
    // =============================================

    login: builder.mutation<
      LoginResponse,
      LoginRequest
    >({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),

    // =============================================
    // Verify OTP
    // =============================================

    verifyOTP: builder.mutation<
      VerifyOTPResponse,
      VerifyOTPRequest
    >({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    // =============================================
    // Resend OTP
    // =============================================

    resendOTP: builder.mutation<
      ResendOTPResponse,
      ResendOTPRequest
    >({
      query: (data) => ({
        url: "/auth/resend-otp",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
} = authApi;