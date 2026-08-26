"use client";

import {
  Box,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
  FormGroup,
  Radio,
  RadioGroup,
} from "@mui/material";

import {
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";

import {
  setFilters,
  resetFilters,
} from "@/redux/slices/filterSlice";

const cuisines = [
  "Italian",
  "Egyptian",
  "American",
  "Asian",
  "Indian",
  "Mexican",
];

const areas = [
  "Downtown",
  "Nasr City",
  "Maadi",
  "Heliopolis",
  "New Cairo",
];

const ratings = [
  {
    label: "4.5 & above",
    value: 4.5,
  },
  {
    label: "4.0 & above",
    value: 4,
  },
  {
    label: "3.0 & above",
    value: 3,
  },
];

export default function RestaurantFilters() {
  const dispatch = useAppDispatch();

  const filters = useAppSelector(
    (state) => state.filter.filters
  );

  const handleCuisineChange = (
    cuisine: string
  ) => {
    dispatch(
      setFilters({
        ...filters,

        cuisine:
          filters.cuisine === cuisine
            ? ""
            : cuisine,

        page: 1,
      })
    );
  };

  const handleAreaChange = (
    area: string
  ) => {
    dispatch(
      setFilters({
        ...filters,

        area:
          filters.area === area
            ? ""
            : area,

        page: 1,
      })
    );
  };

  const handleRatingChange = (
    rating: number
  ) => {
    dispatch(
      setFilters({
        ...filters,

        minRating:
          filters.minRating === rating
            ? null
            : rating,

        page: 1,
      })
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 3,
        border: "1px solid #E5E7EB",
        p: 3,
      }}
    >
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 800 }}
        >
          Filters
        </Typography>

        <Button
          size="small"
          onClick={() =>
            dispatch(resetFilters())
          }
          sx={{
            color: "#E85D04",
          }}
        >
          Reset
        </Button>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Cuisine */}

      <Typography sx={{ fontWeight: 700, mb: 1 }}>
        Cuisine
      </Typography>

      <FormGroup>
        {cuisines.map((cuisine) => (
          <FormControlLabel
            key={cuisine}
            control={
              <Checkbox
                checked={
                  filters.cuisine ===
                  cuisine
                }
                onChange={() =>
                  handleCuisineChange(
                    cuisine
                  )
                }
                sx={{
                  color: "#D1D5DB",

                  "&.Mui-checked": {
                    color: "#E85D04",
                  },
                }}
              />
            }
            label={cuisine}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 3 }} />

      {/* Area */}

      <Typography sx={{ fontWeight: 700, mb: 1 }}>
        Area
      </Typography>

      <FormGroup>
        {areas.map((area) => (
          <FormControlLabel
            key={area}
            control={
              <Checkbox
                checked={
                  filters.area === area
                }
                onChange={() =>
                  handleAreaChange(
                    area
                  )
                }
                sx={{
                  "&.Mui-checked": {
                    color: "#E85D04",
                  },
                }}
              />
            }
            label={area}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 3 }} />

      {/* Rating */}

      <Typography sx={{ fontWeight: 700, mb: 1 }}>
        Rating
      </Typography>

      <FormGroup>
        {ratings.map((rating) => (
          <FormControlLabel
            key={rating.value}
            control={
              <Checkbox
                checked={
                  filters.minRating ===
                  rating.value
                }
                onChange={() =>
                  handleRatingChange(
                    rating.value
                  )
                }
                sx={{
                  "&.Mui-checked": {
                    color: "#E85D04",
                  },
                }}
              />
            }
            label={rating.label}
          />
        ))}
      </FormGroup>

      <Divider sx={{ my: 3 }} />

      {/* Sort */}

      <Typography sx={{ fontWeight: 700, mb: 1 }}>
        Sort By
      </Typography>

      <RadioGroup
        value={filters.sort}
        onChange={(event) => {
          dispatch(
            setFilters({
              ...filters,

              sort: event.target.value,

              page: 1,
            })
          );
        }}
      >
        <FormControlLabel
          value="rating_desc"
          control={<Radio />}
          label="Highest Rating"
        />

        <FormControlLabel
          value="rating_asc"
          control={<Radio />}
          label="Lowest Rating"
        />

        <FormControlLabel
          value="price_asc"
          control={<Radio />}
          label="Price: Low to High"
        />

        <FormControlLabel
          value="price_desc"
          control={<Radio />}
          label="Price: High to Low"
        />
      </RadioGroup>
    </Box>
  );
}