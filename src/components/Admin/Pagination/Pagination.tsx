import React from "react";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface BasicPaginationProps {
  totalItems: number; // Total number of items
  itemsPerPage: number; // Items per page
  currentPage: number; // Current page
  onPageChange: (page: number) => void; // Callback for page change
}

const BasicPagination: React.FC<BasicPaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage); // Calculate total pages

  const handlePageChange = (_event: React.ChangeEvent<unknown>, page: number) => {
    onPageChange(page); // Notify parent of the new page
  };

  return (
    <Stack
      spacing={2}
      sx={{
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <Pagination
        count={totalPages} // Total pages
        page={currentPage} // Current page
        onChange={handlePageChange} // Handle page change
        sx={{
          "& .MuiPaginationItem-root": {
            color: "#b0b0b0", // Default text color
            "&:hover": {
              backgroundColor: "#333333",
              color: "#ffffff",
            },
          },
          "& .Mui-selected": {
            backgroundColor: "#1e90ff !important", // Selected button color
            color: "#ffffff !important",
            fontWeight: "bold",
          },
        }}
      />
    </Stack>
  );
};

export default BasicPagination;
