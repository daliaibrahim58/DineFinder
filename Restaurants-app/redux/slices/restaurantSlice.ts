import {
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import type {
  Restaurant,
} from "@/types/restaurant";

interface RestaurantState {
  selectedRestaurant: Restaurant | null;
}

const initialState: RestaurantState = {
  selectedRestaurant: null,
};

const restaurantSlice = createSlice({
  name: "restaurant",

  initialState,

  reducers: {
    setSelectedRestaurant: (
      state,
      action: PayloadAction<
        Restaurant | null
      >
    ) => {
      state.selectedRestaurant =
        action.payload;
    },

    clearSelectedRestaurant: (
      state
    ) => {
      state.selectedRestaurant = null;
    },
  },
});

export const {
  setSelectedRestaurant,
  clearSelectedRestaurant,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;