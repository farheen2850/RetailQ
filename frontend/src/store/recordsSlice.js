import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchRecords = createAsyncThunk('records/fetchRecords', async (filters = {}, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:5000/api/records', {
      params: filters,
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to fetch records.');
  }
});

export const fetchPriceRange = createAsyncThunk('records/fetchPriceRange', async (_, { rejectWithValue }) => {
  try {
    const response = await axios.get('http://localhost:5000/api/price-range', {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    return rejectWithValue({ message: 'Failed to fetch price range.' });
  }
});

export const updateRecord = createAsyncThunk('records/updateRecord', async (updatedRecord, { rejectWithValue }) => {
  try {
    await axios.put(`http://localhost:5000/api/records/${updatedRecord._id}`, updatedRecord, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    return updatedRecord;
  } catch (error) {
    return rejectWithValue(error.response?.data || 'Failed to update record.');
  }
});

const initialState = {
  records: [],
  priceRange: { minPrice: 0, maxPrice: 100 },
  filters: {
    storeId: '',
    sku: '',
    productName: '',
    startDate: '',
    endDate: '',
    priceMin: 0,
    priceMax: 100,
  },
  isLoading: false,
  error: null,
  selectedRowId: null,
};


const recordsSlice = createSlice({
  name: 'records',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedRowId: (state, action) => {
      state.selectedRowId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchRecords.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.isLoading = false;
        state.records = action.payload;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to fetch records.';
      })
      
      .addCase(fetchPriceRange.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPriceRange.fulfilled, (state, action) => {
        state.isLoading = false;
        state.priceRange = action.payload;
        state.filters.priceMin = action.payload.minPrice;
        state.filters.priceMax = action.payload.maxPrice;
      })
      .addCase(fetchPriceRange.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch price range.';
      })
      
      .addCase(updateRecord.fulfilled, (state, action) => {
        const index = state.records.findIndex((record) => record._id === action.payload._id);
        if (index !== -1) {
          state.records[index] = action.payload;
        }
      });
  },
});

export const { setFilters, setSelectedRowId } = recordsSlice.actions;

export default recordsSlice.reducer;
