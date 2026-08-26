import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import type { RootState } from "./store";

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,

  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;

    const token = state.auth.token;

    if (token) {
      headers.set(
        "Authorization",
        `Bearer ${token}`
      );
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery,

  tagTypes: [
    "Restaurant",
    "Favorite",
    "Review",
    "User",
  ],

  endpoints: () => ({}),
});