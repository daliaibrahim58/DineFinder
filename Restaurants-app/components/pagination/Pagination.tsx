"use client";

import {
  Pagination as MuiPagination,
  Box,
} from "@mui/material";

import {
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";

import {
  setPage,
} from "@/redux/slices/filterSlice";

interface PaginationProps {
  totalPages: number;
}

export default function Pagination({
  totalPages,
}: PaginationProps) {
  const dispatch = useAppDispatch();

  const currentPage =
    useAppSelector(
      (state) =>
        state.filter.filters.page
    );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        py: 5,
      }}
    >
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={(_, page) => {
          dispatch(setPage(page));

          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        color="primary"
        size="large"
        sx={{
          "& .Mui-selected": {
            backgroundColor:
              "#E85D04 !important",
          },
        }}
      />
    </Box>
  );
}