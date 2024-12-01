import React, { useEffect, useState } from 'react';
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Text,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPriceRange, setFilters } from '../store/recordsSlice';
import '../styles/SearchRecordsComponent.css';

const SearchRecords = ({ onSearch }) => {
  const dispatch = useDispatch();

  const { priceRange, filters, error: reduxError, isLoading } = useSelector((state) => state.records);

  const [error, setError] = useState('');

  useEffect(() => {
    dispatch(fetchPriceRange());
  }, [dispatch]);


  const handleFilterChange = (field, value) => {
    dispatch(setFilters({ [field]: value }));

    if (field === 'startDate' || field === 'endDate') {
      const start = field === 'startDate' ? new Date(value) : new Date(filters.startDate);
      const end = field === 'endDate' ? new Date(value) : new Date(filters.endDate);

      if (start && end && start > end) {
        setError('Start date must be earlier than or equal to the end date.');
      } else {
        setError('');
      }
    }
  };

  const handleSearchClick = () => {
    if (error) return;

    const cleanedFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value) acc[key] = value; 
      return acc;
    }, {});

    onSearch(cleanedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      storeId: '',
      sku: '',
      productName: '',
      startDate: '',
      endDate: '',
      priceMin: priceRange.minPrice || '',
      priceMax: priceRange.maxPrice || '',
    };

    dispatch(setFilters(clearedFilters));
    setError('');
    onSearch(clearedFilters);
  };

  return (
    <Box className="search-container" marginBottom="16px">
      <div className="search-flex">
        <FormControl className="search-form-control">
          <FormLabel>Store ID</FormLabel>
          <Input
            placeholder="Enter Store ID"
            value={filters.storeId}
            onChange={(e) => handleFilterChange('storeId', e.target.value)}
          />
        </FormControl>

        <FormControl className="search-form-control">
          <FormLabel>SKU</FormLabel>
          <Input
            placeholder="Enter SKU"
            value={filters.sku}
            onChange={(e) => handleFilterChange('sku', e.target.value)}
          />
        </FormControl>

        <FormControl className="search-form-control">
          <FormLabel>Product Name</FormLabel>
          <Input
            placeholder="Enter Product Name"
            value={filters.productName}
            onChange={(e) => handleFilterChange('productName', e.target.value)}
          />
        </FormControl>

        <FormControl className="search-form-control">
          <FormLabel>Start Date</FormLabel>
          <Input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />
        </FormControl>

        <FormControl className="search-form-control">
          <FormLabel>End Date</FormLabel>
          <Input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />
        </FormControl>

        <FormControl className="search-form-control">
          <FormLabel>Price Min</FormLabel>
          <Input
            type="number"
            value={filters.priceMin || priceRange.minPrice}
            onChange={(e) => handleFilterChange('priceMin', e.target.value)}
          />
        </FormControl>

        <FormControl className="search-form-control">
          <FormLabel>Price Max</FormLabel>
          <Input
            type="number"
            value={filters.priceMax || priceRange.maxPrice}
            onChange={(e) => handleFilterChange('priceMax', e.target.value)}
          />
        </FormControl>

        <Button
          className="search-button"
          colorScheme="blue"
          onClick={handleSearchClick}
          isDisabled={!!error || isLoading}
        >
          Search
        </Button>

        <Button
          className="clear-button"
          variant="outline"
          onClick={handleClearFilters}
          marginLeft="10px"
        >
          Clear Filters
        </Button>
      </div>

      {(error || reduxError) && (
        <Text className="search-error">{error || reduxError}</Text>
      )}
    </Box>
  );
};

export default SearchRecords;
