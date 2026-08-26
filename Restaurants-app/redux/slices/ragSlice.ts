import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import type {
  RagRestaurant,
  RagFilters,
} from "@/types/restaurant";

interface RagState {
  query: string;

  answer: string;

  restaurants: RagRestaurant[];

  filters: RagFilters | null;
}

const initialState: RagState = {
  query: "",

  answer: "",

  restaurants: [],

  filters: null,
};

const ragSlice = createSlice({
  name: "rag",

  initialState,

  reducers: {
    setRagResults: (
      state,
      action: PayloadAction<{
        query: string;

        answer: string;

        restaurants: RagRestaurant[];

        filters: RagFilters;
      }>
    ) => {
      state.query = action.payload.query;

      state.answer = action.payload.answer;

      state.restaurants =
        action.payload.restaurants;

      state.filters =
        action.payload.filters;
    },

    clearRagResults: (state) => {
      state.query = "";

      state.answer = "";

      state.restaurants = [];

      state.filters = null;
    },
  },
});

export const {
  setRagResults,
  clearRagResults,
} = ragSlice.actions;

export default ragSlice.reducer;