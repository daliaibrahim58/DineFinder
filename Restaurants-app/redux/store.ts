import { configureStore } from "@reduxjs/toolkit";

import restaurantReducer from "./slices/restaurantSlice";
import filterReducer from "./slices/filterSlice";
import authReducer from "./slices/authSlice";
import ragReducer from "./slices/ragSlice";

import { apiSlice } from "./apiSlice";

export const store = configureStore({
  reducer: {
    restaurant: restaurantReducer,
    filter: filterReducer,
    auth: authReducer,
    rag: ragReducer,

    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
