import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFavorites, addFavorite, removeFavorite } from '../../services/apiService';

export const fetchFavorites = createAsyncThunk('favorites/fetchFavorites', async (_, { rejectWithValue }) => {
  try {
    const res = await getFavorites();
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const addToFavorites = createAsyncThunk('favorites/addToFavorites', async (movieData, { rejectWithValue }) => {
  try {
    const res = await addFavorite(movieData);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const removeFromFavorites = createAsyncThunk('favorites/removeFromFavorites', async (movieId, { rejectWithValue }) => {
  try {
    const res = await removeFavorite(movieId);
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFavorites: (state) => { state.items = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => { state.loading = true; })
      .addCase(fetchFavorites.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchFavorites.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addToFavorites.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(addToFavorites.rejected, (state, action) => { state.error = action.payload; })
      .addCase(removeFromFavorites.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(removeFromFavorites.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
