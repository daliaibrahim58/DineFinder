import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Filters {
  search: string;
  cuisine: string;
  area: string;

  minPrice: number | null;
  maxPrice: number | null;
  minRating: number | null;

  sort: string;
  latitude?: number;
  longitude?: number;
  distance?: number;

  page: number;
  limit: number;
}

interface FilterState {
  filters: Filters;
}

const initialFilters: Filters = {
  search: "",

  cuisine: "",
  area: "",

  minPrice: null,
  maxPrice: null,

  minRating: null,

  sort: "rating_desc",

  page: 1,
  limit: 10,
};

const initialState: FilterState = {
  filters: initialFilters,
};

const filterSlice = createSlice({
  name: "filter",

  initialState,

  reducers: {
    // Change all filters
    setFilters: (state, action: PayloadAction<Filters>) => {
      state.filters = action.payload;
    },

    // Change page
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = action.payload;
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = {
        ...initialFilters,
      };
    },
  },
});

export const { setFilters, setPage, resetFilters } = filterSlice.actions;

export default filterSlice.reducer;
