import React, { useState } from 'react';
import { Table, Tbody, Td, Thead, Tr, Th, Checkbox, Spinner, Box, Text, TableContainer } from '@chakra-ui/react';
import SortingComponent from './SortingComponent';
import PaginationComponent from './PaginationComponent';
import useDateFormatter from '../hooks/useDateFormatter';
import '../styles/TableComponent.css';

const TableComponent = ({ records, isLoading, selectedRowId, onCheckboxChange }) => {
  const { formatDate } = useDateFormatter();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10); 
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  const totalPages = Math.ceil(records.length / pageSize);

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (direction === 'next') {
        return Math.min(prev + 1, totalPages);
      }
      if (direction === 'prev') {
        return Math.max(prev - 1, 1);
      }
      return prev;
    });
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      const isSameKey = prev.key === key;
      const direction = isSameKey && prev.direction === 'asc' ? 'desc' : 'asc';
      return { key, direction };
    });
  };

  const sortedRecords = [...records].sort((a, b) => {
    if (!sortConfig.key) return 0; // No sorting
    const { key, direction } = sortConfig;

    let comparison = 0;
    if (a[key] > b[key]) comparison = 1;
    if (a[key] < b[key]) comparison = -1;

    return direction === 'asc' ? comparison : -comparison;
  });

  const paginatedRecords = sortedRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="200px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!records.length) {
    return (
      <Box textAlign="center" padding="20px">
        <Text>No records available.</Text>
      </Box>
    );
  }

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); 
  };

  return (
    <Box>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th width="50px"></Th>
              <SortingComponent handleSort={handleSort} sortConfig={sortConfig} />
            </Tr>
          </Thead>
          <Tbody>
            {paginatedRecords.map((record) => (
              <Tr
                key={record._id}
                className={`table-row ${selectedRowId === record._id ? 'selected-row' : ''}`}
                _hover={{ bg: 'gray.100' }}
              >
                <Td>
                  <Checkbox
                    isChecked={selectedRowId === record._id}
                    onChange={() => onCheckboxChange(record._id)}
                  />
                </Td>
                <Td>{record.storeId}</Td>
                <Td>{record.sku}</Td>
                <Td>{record.productName}</Td>
                <Td>{record.price}</Td>
                <Td>{formatDate(record.date, 'YYYY-MM-DD')}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        handlePageChange={handlePageChange}
        pageSize={pageSize}
        handlePageSizeChange={handlePageSizeChange}
      />
    </Box>
  );
};

export default TableComponent;
