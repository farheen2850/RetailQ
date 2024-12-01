import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Spinner,
  Text,
  Box,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadFile, resetStatusMessage } from '../store/fileUploadSlice';
import '../styles/FileUploadModal.css';

const FileUploadModal = ({ isOpen, onClose, onFileUpload }) => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const toast = useToast();

  const { isUploading, statusMessage } = useSelector((state) => state.fileUpload);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    dispatch(resetStatusMessage());
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please choose a file before uploading.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    dispatch(uploadFile(file))
      .unwrap()
      .then(() => {
        toast({
          title: 'Upload successful',
          description: `File "${file.name}" has been uploaded successfully.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        onFileUpload(file);
        setFile(null);
        onClose();
      })
      .catch((error) => {
        toast({
          title: 'Upload failed',
          description: error.message || 'An error occurred during upload.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent className="modal-content">
        <ModalHeader className="modal-header">Upload File</ModalHeader>
        <ModalCloseButton />
        <ModalBody className="modal-body">
          {isUploading ? (
            <Box className="loading-box">
              <Spinner size="xl" className="loading-spinner" />
              <Text className="loading-text">Uploading your file...</Text>
            </Box>
          ) : (
            <VStack spacing={4} align="stretch">
              <Box as="label" className="file-input">
                {file ? file.name : 'Choose File'}
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </Box>
              {statusMessage && (
                <Text
                  className={`status-message ${
                    statusMessage.includes('failed') ? 'error-message' : 'success-message'
                  }`}
                >
                  {statusMessage}
                </Text>
              )}
            </VStack>
          )}
        </ModalBody>
        {!isUploading && (
          <ModalFooter className="modal-footer">
            <Button
              colorScheme="blue"
              onClick={handleSubmit}
              isDisabled={!file}
            >
              Upload
            </Button>
            <Button variant="outline" onClick={onClose} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        )}
      </ModalContent>
    </Modal>
  );
};

export default FileUploadModal;
