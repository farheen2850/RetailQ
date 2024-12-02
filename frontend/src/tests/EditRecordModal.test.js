import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ChakraProvider } from '@chakra-ui/react';
import EditRecordModal from '../components/EditRecordModal';

const renderWithChakra = (ui) => render(<ChakraProvider>{ui}</ChakraProvider>);

describe('EditRecordModal', () => {
  const record = {
    _id: '1',
    storeId: '123',
    sku: 'ABC-123',
    productName: 'Test Product',
    price: '10.99',
    date: '2023-12-01',
  };

  const onSave = jest.fn();
  const onClose = jest.fn();

  it('renders correctly when modal is open', () => {
    renderWithChakra(
      <EditRecordModal isOpen={true} onClose={onClose} record={record} onSave={onSave} />
    );

    expect(screen.getByText(/edit record/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/store id/i)).toHaveValue(record.storeId);
    expect(screen.getByLabelText(/sku/i)).toHaveValue(record.sku);
    expect(screen.getByLabelText(/product name/i)).toHaveValue(record.productName);
    expect(screen.getByLabelText(/price/i)).toHaveValue(Number(record.price));
    expect(screen.getByLabelText(/date/i)).toHaveValue('2023-12-01');
  });

  it('validates fields and shows error messages', () => {
    renderWithChakra(
      <EditRecordModal isOpen={true} onClose={onClose} record={record} onSave={onSave} />
    );

    const storeIdInput = screen.getByLabelText(/store id/i);
    fireEvent.change(storeIdInput, { target: { value: '' } });
    fireEvent.blur(storeIdInput);
    expect(screen.getByText(/store id is required/i)).toBeInTheDocument();

    const priceInput = screen.getByLabelText(/price/i);
    fireEvent.change(priceInput, { target: { value: '-10' } });
    fireEvent.blur(priceInput);
    expect(screen.getByText(/price must be a positive number/i)).toBeInTheDocument();
  });

  it('calls onSave with correct data when Save button is clicked', () => {
    renderWithChakra(
      <EditRecordModal isOpen={true} onClose={onClose} record={record} onSave={onSave} />
    );

    fireEvent.change(screen.getByLabelText(/store id/i), { target: { value: '456' } });
    fireEvent.change(screen.getByLabelText(/sku/i), { target: { value: 'DEF-456' } });
    fireEvent.click(screen.getByText(/save/i));

    expect(onSave).toHaveBeenCalledWith({
      _id: '1',
      storeId: '456',
      sku: 'DEF-456',
      productName: 'Test Product',
      price: '10.99',
      date: '2023-12-01',
    });
  });

  it('calls onClose when Cancel button is clicked', () => {
    renderWithChakra(
      <EditRecordModal isOpen={true} onClose={onClose} record={record} onSave={onSave} />
    );

    fireEvent.click(screen.getByText(/cancel/i));
    expect(onClose).toHaveBeenCalled();
  });
});
