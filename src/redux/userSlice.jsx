// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      // Remove from localStorage
      localStorage.removeItem('currentUser');
    },
    loadUserFromStorage: (state) => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        try {
          state.currentUser = JSON.parse(savedUser);
          state.isAuthenticated = true;
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem('currentUser');
        }
      }
    },
  },
});

export const { login, logout, loadUserFromStorage } = userSlice.actions;
export default userSlice.reducer;