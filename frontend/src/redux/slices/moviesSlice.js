import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getTrending, getPopularMovies, getPopularTV, discoverMovies, discoverTV } from '../../services/tmdbService';

export const fetchTrending = createAsyncThunk('movies/fetchTrending', async (_, { rejectWithValue }) => {
  try {
    const res = await getTrending('all', 'week', 1);
    return res.data.results;
  } catch (err) {
    return rejectWithValue(err.response?.data?.status_message || err.message);
  }
});

export const fetchPopularMovies = createAsyncThunk('movies/fetchPopular', async (page = 1, { rejectWithValue }) => {
  try {
    const res = await getPopularMovies(page);
    return { results: res.data.results, page: res.data.page, totalPages: res.data.total_pages };
  } catch (err) {
    return rejectWithValue(err.response?.data?.status_message || err.message);
  }
});

export const fetchDiscoverMovies = createAsyncThunk('movies/fetchDiscoverMovies', async ({ page, genreId }, { rejectWithValue }) => {
  try {
    const res = await discoverMovies(page, genreId);
    return { results: res.data.results, page: res.data.page, totalPages: res.data.total_pages };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchDiscoverTV = createAsyncThunk('movies/fetchDiscoverTV', async ({ page, genreId }, { rejectWithValue }) => {
  try {
    const res = await discoverTV(page, genreId);
    return { results: res.data.results, page: res.data.page, totalPages: res.data.total_pages };
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    trending: [],
    popular: [],
    discoverMovies: [],
    discoverTV: [],
    discoverPage: 1,
    discoverTvPage: 1,
    discoverTotalPages: 1,
    discoverTvTotalPages: 1,
    loading: false,
    trendingLoading: false,
    error: null,
  },
  reducers: {
    resetDiscover: (state) => {
      state.discoverMovies = [];
      state.discoverPage = 1;
      state.discoverTotalPages = 1;
    },
    resetDiscoverTV: (state) => {
      state.discoverTV = [];
      state.discoverTvPage = 1;
      state.discoverTvTotalPages = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrending.pending, (state) => { state.trendingLoading = true; })
      .addCase(fetchTrending.fulfilled, (state, action) => {
        state.trendingLoading = false;
        state.trending = action.payload;
      })
      .addCase(fetchTrending.rejected, (state, action) => {
        state.trendingLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchPopularMovies.pending, (state) => { state.loading = true; })
      .addCase(fetchPopularMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.popular = action.payload.results;
      })
      .addCase(fetchPopularMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDiscoverMovies.pending, (state) => { state.loading = true; })
      .addCase(fetchDiscoverMovies.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.discoverMovies = action.payload.results;
        } else {
          state.discoverMovies = [...state.discoverMovies, ...action.payload.results];
        }
        state.discoverPage = action.payload.page;
        state.discoverTotalPages = action.payload.totalPages;
      })
      .addCase(fetchDiscoverMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDiscoverTV.pending, (state) => { state.loading = true; })
      .addCase(fetchDiscoverTV.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.page === 1) {
          state.discoverTV = action.payload.results;
        } else {
          state.discoverTV = [...state.discoverTV, ...action.payload.results];
        }
        state.discoverTvPage = action.payload.page;
        state.discoverTvTotalPages = action.payload.totalPages;
      })
      .addCase(fetchDiscoverTV.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDiscover, resetDiscoverTV } = moviesSlice.actions;
export default moviesSlice.reducer;
