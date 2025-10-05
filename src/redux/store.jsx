// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import cartReducer from './cartSlice';
import productsReducer from './productsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    products: productsReducer,
  },
});

// Subscribe to store changes to persist cart data
store.subscribe(() => {
  const cartState = store.getState().cart;
  if (cartState.isInitialized) {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('shopHubCart', JSON.stringify(cartState.cart));
  }
});