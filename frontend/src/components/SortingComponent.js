// SortingComponent.js
import React from 'react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { Th } from '@chakra-ui/react';

const SortingComponent = ({ handleSort, sortConfig }) => {
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? <ChevronUpIcon ml={2} /> : <ChevronDownIcon ml={2} />;
    }
    return null;
  };

  return (
    <>
      <Th onClick={() => handleSort('storeId')} cursor="pointer">
        Store ID {getSortIcon('storeId')}
      </Th>
      <Th onClick={() => handleSort('sku')} cursor="pointer">
        SKU {getSortIcon('sku')}
      </Th>
      <Th onClick={() => handleSort('productName')} cursor="pointer">
        Product Name {getSortIcon('productName')}
      </Th>
      <Th onClick={() => handleSort('price')} cursor="pointer">
        Price {getSortIcon('price')}
      </Th>
      <Th onClick={() => handleSort('date')} cursor="pointer">
        Date {getSortIcon('date')}
      </Th>
    </>
  );
};

export default SortingComponent;
