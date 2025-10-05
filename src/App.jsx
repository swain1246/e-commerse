// src/App.js
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { loadUserFromStorage } from './redux/userSlice';
import { loadCartFromStorage, markAsInitialized } from './redux/cartSlice';
import LoginPage from './pages/LoginPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import SignupPage from './pages/SignupPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  // Load data from localStorage when app starts
  useEffect(() => {
    store.dispatch(loadUserFromStorage());
    store.dispatch(loadCartFromStorage());
    store.dispatch(markAsInitialized());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/product" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;