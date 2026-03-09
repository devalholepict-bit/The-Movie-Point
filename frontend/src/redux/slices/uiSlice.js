import { createSlice } from '@reduxjs/toolkit';

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    theme: savedTheme || (prefersDark ? 'dark' : 'light'),
    searchQuery: '',
    trailerOpen: false,
    trailerId: null,
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme', state.theme);
      document.documentElement.setAttribute('data-theme', state.theme);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
      document.documentElement.setAttribute('data-theme', action.payload);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    openTrailer: (state, action) => {
      state.trailerOpen = true;
      state.trailerId = action.payload;
    },
    closeTrailer: (state) => {
      state.trailerOpen = false;
      state.trailerId = null;
    },
  },
});

export const { toggleTheme, setTheme, setSearchQuery, openTrailer, closeTrailer } = uiSlice.actions;
export default uiSlice.reducer;
