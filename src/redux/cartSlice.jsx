// src/redux/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
  cartCount: 0,
  totalPrice: 0,
  isInitialized: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.cart.find(item => item.id === product.id);
      
      if (existingItem) {
        // If product already exists in cart, increase quantity
        state.cart = state.cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If product is new to cart, add it
        state.cart = [...state.cart, { ...product, quantity: 1 }];
      }
      
      // Recalculate totals
      cartSlice.caseReducers.calculateCartTotals(state);
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter(item => item.id !== productId);
      
      // Recalculate totals
      cartSlice.caseReducers.calculateCartTotals(state);
    },
    updateQuantity: (state, action) => {
      const { productId, newQuantity } = action.payload;
      if (newQuantity < 1) {
        state.cart = state.cart.filter(item => item.id !== productId);
      } else {
        state.cart = state.cart.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      // Recalculate totals
      cartSlice.caseReducers.calculateCartTotals(state);
    },
    clearCart: (state) => {
      state.cart = [];
      state.cartCount = 0;
      state.totalPrice = 0;
      
      // Save to localStorage
      localStorage.setItem('shopHubCart', JSON.stringify([]));
    },
    calculateCartTotals: (state) => {
      // Calculate cart count
      state.cartCount = state.cart.reduce((total, item) => total + item.quantity, 0);
      
      // Calculate total price
      state.totalPrice = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Save cart to localStorage
      localStorage.setItem('shopHubCart', JSON.stringify(state.cart));
    },
    loadCartFromStorage: (state) => {
      const savedCart = localStorage.getItem('shopHubCart');
      if (savedCart) {
        try {
          state.cart = JSON.parse(savedCart);
          // Calculate totals after loading
          cartSlice.caseReducers.calculateCartTotals(state);
        } catch (error) {
          console.error('Error parsing cart data:', error);
          localStorage.removeItem('shopHubCart');
        }
      }
    },
    markAsInitialized: (state) => {
      state.isInitialized = true;
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  calculateCartTotals,
  loadCartFromStorage,
  markAsInitialized
} = cartSlice.actions;
export default cartSlice.reducer;