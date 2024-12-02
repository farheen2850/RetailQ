import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector, useDispatch } from 'react-redux';
import ListComponent from '../components/ListComponent';

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

describe('ListComponent', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useDispatch.mockReturnValue(mockDispatch);

    useSelector.mockImplementation((callback) =>
      callback({
        records: {
          records: [
            { _id: '1', productName: 'Product 1', price: '10.00' },
            { _id: '2', productName: 'Product 2', price: '20.00' },
          ],
          priceRange: { min: 10, max: 100 },
          isLoading: false,
          filters: {},
          selectedRowId: null,
        },
        fileUpload: {
          isUploading: false,
          statusMessage: '', 
        },
      })
    );
  });

  it('renders correctly', () => {
    render(<ListComponent />);
    expect(screen.getByText(/upload file/i)).toBeInTheDocument();
    expect(screen.getByText(/edit record/i)).toBeInTheDocument();
    expect(screen.getByText(/product 1/i)).toBeInTheDocument();
    expect(screen.getByText(/product 2/i)).toBeInTheDocument();
  });

  it('dispatches fetchRecords on load', () => {
    render(<ListComponent />);
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('handles file upload click', () => {
    render(<ListComponent />);
    fireEvent.click(screen.getByText(/upload file/i));
    expect(mockDispatch).toHaveBeenCalled(); 
  });
});
