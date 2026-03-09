import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getHistory, addToHistory, clearHistory } from '../../services/apiService';

export const fetchHistory = createAsyncThunk('history/fetchHistory', async (_, { rejectWithValue }) => {
  try {
    const res = await getHistory();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addHistory = createAsyncThunk('history/addHistory', async (data, { rejectWithValue }) => {
  try {
    const res = await addToHistory(data);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const clearWatchHistory = createAsyncThunk('history/clearHistory', async (_, { rejectWithValue }) => {
  try {
    await clearHistory();
    return [];
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const historySlice = createSlice({
  name: 'history',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearLocalHistory: (state) => { state.items = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => { state.loading = true; })
      .addCase(fetchHistory.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchHistory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addHistory.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(clearWatchHistory.fulfilled, (state) => { state.items = []; });
  },
});

export const { clearLocalHistory } = historySlice.actions;
export default historySlice.reducer;
