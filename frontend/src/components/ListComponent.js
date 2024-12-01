import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import FileUploadModal from './FileUploadModal';
import TableComponent from './TableComponent';
import EditRecordModal from './EditRecordModal';
import SearchRecords from './SearchRecordsComponent';
import {
  fetchRecords,
  fetchPriceRange,
  updateRecord,
  setFilters,
  setSelectedRowId,
} from '../store/recordsSlice';
import '../styles/ListComponent.css';

const ListComponent = () => {
  const dispatch = useDispatch();

  const {
    records,
    priceRange,
    isLoading,
    filters,
    selectedRowId,
  } = useSelector((state) => state.records); 
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    dispatch(fetchRecords(filters));
    dispatch(fetchPriceRange());
  }, [dispatch, filters]);

  const handleSearch = (newFilters) => {
    dispatch(setFilters(newFilters));
    dispatch(fetchRecords(newFilters));
  };

  const handleFileUpload = () => {
    dispatch(fetchRecords(filters));
  };

  const handleUpdateRecord = (updatedRecord) => {
    dispatch(updateRecord(updatedRecord)).then(() => onEditClose());
  };

  const handleCheckboxChange = (recordId) => {
    dispatch(setSelectedRowId(recordId === selectedRowId ? null : recordId));
  };

  const handleEditClick = () => {
    const recordToEdit = records.find((record) => record._id === selectedRowId);
    if (recordToEdit) {
      onEditOpen();
    }
  };

  return (
    <Box className="list-component-container">

      <Box className="list-component-buttons fixed-buttons">
        <Button colorScheme="blue" onClick={onOpen}>
          Upload File
        </Button>
        <Button
          colorScheme="green"
          onClick={handleEditClick}
          isDisabled={!selectedRowId}
        >
          Edit Record
        </Button>
      </Box>

      <SearchRecords priceRange={priceRange} onSearch={handleSearch} />

      <TableComponent
        records={records}
        isLoading={isLoading}
        selectedRowId={selectedRowId}
        onCheckboxChange={handleCheckboxChange}
      />

      <FileUploadModal
        isOpen={isOpen}
        onClose={onClose}
        onFileUpload={handleFileUpload}
      />

      {selectedRowId && (
        <EditRecordModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          record={records.find((record) => record._id === selectedRowId)}
          onSave={handleUpdateRecord}
        />
      )}
    </Box>
  );
};

export default ListComponent;
