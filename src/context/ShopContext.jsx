// ShopContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';

// Create the context
const ShopContext = createContext();

// Custom hook to use the context
export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};

// Create the provider component
export const ShopProvider = ({ children }) => {
  // User state
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Cart state
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load user and cart from localStorage on mount
  useEffect(() => {
    
    // Load user from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('shopHubCart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Error parsing cart data:', error);
        localStorage.removeItem('shopHubCart');
      }
    }
    
    // Mark as initialized
    setIsInitialized(true);
  }, []);

  // Update cart count and total price whenever cart changes
  useEffect(() => {
    if (!isInitialized) return; // Don't save to localStorage during initial load
    
    // Calculate cart count
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartCount(count);
    
    // Calculate total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setTotalPrice(total);
    
    // Save cart to localStorage
    localStorage.setItem('shopHubCart', JSON.stringify(cart));
  }, [cart, isInitialized]);

  // Login function
  const login = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  // Add product to cart
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // If product already exists in cart, increase quantity
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // If product is new to cart, add it
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  // Remove product from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  // Update product quantity in cart
  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear the entire cart
  const clearCart = () => {
    setCart([]);
  };

  // Get quantity of a specific product in cart
  const getProductQuantity = (productId) => {
    const item = cart.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Context value
  const value = {
    // User state
    currentUser,
    isAuthenticated,
    login,
    logout,
    
    // Cart state
    cart,
    cartCount,
    totalPrice,
    getProductQuantity,
    
    // Cart actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };

  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
};