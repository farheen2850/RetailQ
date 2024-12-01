import React from 'react';
import { Box, Button, Text, Select } from '@chakra-ui/react';
import '../styles/PaginationComponent.css';

const PaginationComponent = ({
  currentPage,
  totalPages,
  handlePageChange,
  pageSize,
  handlePageSizeChange,
}) => (
  <Box className="pagination-container">
    <Box className="pagination-left">
      <Button
        onClick={() => handlePageChange('prev')}
        isDisabled={currentPage === 1}
        variant="outline"
        className="pagination-button"
      >
        Previous
      </Button>
      <Text className="pagination-text">
        Page {currentPage} of {totalPages}
      </Text>
    </Box>
    <Box className="pagination-right">
      <Select
        value={pageSize}
        onChange={(e) => handlePageSizeChange(Number(e.target.value))}
        className="pagination-select"
      >
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </Select>
      <Button
        onClick={() => handlePageChange('next')}
        isDisabled={currentPage === totalPages}
        variant="outline"
        className="pagination-button"
      >
        Next
      </Button>
    </Box>
  </Box>
);

export default PaginationComponent;
