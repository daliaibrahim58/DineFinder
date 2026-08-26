import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

// =====================================================
// User
// =====================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin";

  favorites: string[];
}

// =====================================================
// Auth State
// =====================================================

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

// =====================================================
// Initial State
// =====================================================

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

// =====================================================
// Slice
// =====================================================

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // ===================================================
    // Login
    // ===================================================

    login: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>
    ) => {
      state.user = {
        ...action.payload.user,

        favorites:
          action.payload.user.favorites ?? [],
      };

      state.token =
        action.payload.token;

      state.isAuthenticated = true;

      // Save authentication
      if (
        typeof window !==
        "undefined"
      ) {
        localStorage.setItem(
          "auth",
          JSON.stringify({
            user: state.user,
            token: state.token,
          })
        );
      }
    },

    // ===================================================
    // Restore Auth
    // ===================================================

    restoreAuth: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
      }>
    ) => {
      state.user = {
        ...action.payload.user,

        favorites:
          action.payload.user
            .favorites ?? [],
      };

      state.token =
        action.payload.token;

      state.isAuthenticated = true;
    },

    // ===================================================
    // Logout
    // ===================================================

    logout: (state) => {
      state.user = null;

      state.token = null;

      state.isAuthenticated =
        false;

      if (
        typeof window !==
        "undefined"
      ) {
        localStorage.removeItem(
          "auth"
        );
      }
    },

    // ===================================================
    // Update User
    // ===================================================

    setUser: (
      state,
      action: PayloadAction<User>
    ) => {
      state.user = {
        ...action.payload,

        favorites:
          action.payload
            .favorites ?? [],
      };

      // Update localStorage
      if (
        typeof window !==
        "undefined"
      ) {
        const savedAuth =
          localStorage.getItem(
            "auth"
          );

        if (savedAuth) {
          try {
            const auth =
              JSON.parse(
                savedAuth
              );

            localStorage.setItem(
              "auth",
              JSON.stringify({
                ...auth,

                user: state.user,
              })
            );
          } catch {
            // Ignore invalid localStorage
          }
        }
      }
    },
  },
});

// =====================================================
// Actions
// =====================================================

export const {
  login,
  restoreAuth,
  logout,
  setUser,
} = authSlice.actions;

// =====================================================
// Reducer
// =====================================================

export default authSlice.reducer;