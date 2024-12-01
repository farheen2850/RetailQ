import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import '../styles/EditRecordModal.css';

const EditRecordModal = ({ isOpen, onClose, record, onSave }) => {
  const [formData, setFormData] = useState({
    storeId: '',
    sku: '',
    productName: '',
    price: '',
    date: '',
  });

  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        _id: record._id || '', 
        storeId: record?.storeId || '',
        sku: record?.sku || '',
        productName: record?.productName || '',
        price: record?.price || '',
        date: record?.date ? record.date.split('T')[0] : '',
      });
      setErrors({});
      setIsDirty(false);
    }
  }, [isOpen, record]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setIsDirty(true);
    validateField(name, value);
  };

  const validateField = (field, value) => {
    let error = '';

    if (field === 'storeId' && !value.trim()) {
      error = 'Store ID is required.';
    } else if (field === 'sku' && !value.trim()) {
      error = 'SKU is required.';
    } else if (field === 'productName' && !value.trim()) {
      error = 'Product Name is required.';
    } else if (field === 'price' && (isNaN(value) || Number(value) <= 0)) {
      error = 'Price must be a positive number.';
    } else if (field === 'date') {
      const date = new Date(value);
      if (!value || isNaN(date.getTime())) {
        error = 'Please select a valid date.';
      }
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleSaveClick = () => {
    const hasErrors = Object.values(errors).some((err) => err);
    if (hasErrors) return;

    onSave(formData);
    setIsDirty(false);
    onClose();
  };

  const handleCancelClick = () => {
    setFormData({
      storeId: record?.storeId || '',
      sku: record?.sku || '',
      productName: record?.productName || '',
      price: record?.price || '',
      date: record?.date ? record.date.split('T')[0] : '',
    });
    setErrors({});
    setIsDirty(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleCancelClick} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Record</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl isInvalid={!!errors.storeId}>
            <FormLabel>Store ID</FormLabel>
            <Input
              name="storeId"
              value={formData.storeId}
              onChange={handleChange}
              placeholder="Enter Store ID"
            />
            <FormErrorMessage>{errors.storeId}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.sku} mt={4}>
            <FormLabel>SKU</FormLabel>
            <Input
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              placeholder="Enter SKU"
            />
            <FormErrorMessage>{errors.sku}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.productName} mt={4}>
            <FormLabel>Product Name</FormLabel>
            <Input
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              placeholder="Enter Product Name"
            />
            <FormErrorMessage>{errors.productName}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.price} mt={4}>
            <FormLabel>Price</FormLabel>
            <Input
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter Price"
            />
            <FormErrorMessage>{errors.price}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.date} mt={4}>
            <FormLabel>Date</FormLabel>
            <Input
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.date}</FormErrorMessage>
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="blue"
            onClick={handleSaveClick}
            isDisabled={Object.values(errors).some((error) => error) || !isDirty}
          >
            Save
          </Button>
          <Button variant="outline" onClick={handleCancelClick} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditRecordModal;
