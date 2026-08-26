import { apiSlice } from "../apiSlice";

import type { User } from "../slices/authSlice";

// =====================================================
// Response
// =====================================================

interface FavoritesResponse {
  success: boolean;
  message: string;

  data: {
    favorites: string[];
  };
}

// =====================================================
// API
// =====================================================

export const favoriteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // =============================================
    // Get Favorites
    // =============================================

    getFavorites: builder.query<
      FavoritesResponse,
      void
    >({
      query: () => ({
        url: "/favorites",
        method: "GET",
      }),

      providesTags: ["Favorite"],
    }),

    // =============================================
    // Add Favorite
    // =============================================

    addFavorite: builder.mutation<
      FavoritesResponse,
      string
    >({
      query: (restaurantId) => ({
        url: `/favorites/${restaurantId}`,
        method: "POST",
      }),

      invalidatesTags: ["Favorite"],
    }),

    // =============================================
    // Remove Favorite
    // =============================================

    removeFavorite: builder.mutation<
      FavoritesResponse,
      string
    >({
      query: (restaurantId) => ({
        url: `/favorites/${restaurantId}`,
        method: "DELETE",
      }),

      invalidatesTags: ["Favorite"],
    }),
  }),
});

// =====================================================
// Hooks
// =====================================================

export const {
  useGetFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoriteApi;