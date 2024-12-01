import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const uploadFile = createAsyncThunk(
  'fileUpload/uploadFile',
  async (file, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred.');
    }
  }
);

const fileUploadSlice = createSlice({
  name: 'fileUpload',
  initialState: {
    isUploading: false,
    statusMessage: '',
  },
  reducers: {
    resetStatusMessage: (state) => {
      state.statusMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.isUploading = true;
        state.statusMessage = '';
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.isUploading = false;
        state.statusMessage = 'File uploaded successfully!';
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isUploading = false;
        state.statusMessage = action.payload;
      });
  },
});

export const { resetStatusMessage } = fileUploadSlice.actions;
export default fileUploadSlice.reducer;
