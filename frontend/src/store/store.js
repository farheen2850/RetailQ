import { configureStore } from '@reduxjs/toolkit';
import recordsReducer from './recordsSlice';
import fileUploadReducer from './fileUploadSlice';

const store = configureStore({
  reducer: {
    records: recordsReducer,
    fileUpload: fileUploadReducer
  },
});

export default store;
