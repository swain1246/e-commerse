// src/pages/CartPage.js
import React, { useState } from 'react';
import { FaPlus, FaMinus, FaTrash, FaArrowLeft, FaTimes, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateQuantity, removeFromCart, clearCart } from '../redux/cartSlice';

const CartPage = () => {
  const dispatch = useDispatch();
  
  // Select state from Redux store
  const cart = useSelector((state) => state.cart.cart);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  const isInitialized = useSelector((state) => state.cart.isInitialized);
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleIncrement = (productId) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      dispatch(updateQuantity({ productId, newQuantity: item.quantity + 1 }));
    }
  };

  const handleDecrement = (productId) => {
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
      dispatch(updateQuantity({ productId, newQuantity: item.quantity - 1 }));
    }
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleCheckoutClick = () => {
    setShowCheckoutModal(true);
  };

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsProcessing(false);
      setOrderSuccess(true);
      
      // Clear cart after successful order
      setTimeout(() => {
        dispatch(clearCart());
        setShowCheckoutModal(false);
        setOrderSuccess(false);
      }, 2000);
    }, 1500);
  };

  const closeModal = () => {
    setShowCheckoutModal(false);
    setOrderSuccess(false);
  };

  // Calculate order totals
  const shipping = 5.00;
  const taxRate = 0.08;
  const taxAmount = totalPrice * taxRate;
  const orderTotal = totalPrice + shipping + taxAmount;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col">
        <header className="bg-gray-800 shadow-md p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">Shopping Cart</h1>
          </div>
        </header>
        
        <main className="flex-grow container mx-auto px-4 py-12 flex flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Add some products to your cart to continue shopping</p>
            <Link 
              to="/product" 
              className="inline-flex items-center bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg transition duration-300"
            >
              <FaArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Shopping Cart</h1>
          <button 
            onClick={() => dispatch(clearCart())}
            className="text-red-500 hover:text-red-400 flex items-center"
          >
            <FaTrash className="mr-1" />
            Clear Cart
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="space-y-4">
          {cart.map(item => (
            <div key={item.id} className="bg-gray-800 rounded-lg p-4 flex items-center">
              {/* Product Image */}
              <div className="w-24 h-24 flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover rounded"
                />
              </div>
              
              {/* Product Details */}
              <div className="ml-4 flex-grow">
                <h3 className="text-lg font-medium">{item.title}</h3>
                <p className="text-gray-400 text-sm">₹{item.price.toFixed(2)} each</p>
              </div>
              
              {/* Quantity Controls */}
              <div className="flex items-center">
                <button 
                  onClick={() => handleDecrement(item.id)}
                  className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
                >
                  <FaMinus className="text-sm" />
                </button>
                <span className="mx-3 w-8 text-center">{item.quantity}</span>
                <button 
                  onClick={() => handleIncrement(item.id)}
                  className="bg-gray-700 hover:bg-gray-600 w-8 h-8 rounded-full flex items-center justify-center"
                >
                  <FaPlus className="text-sm" />
                </button>
              </div>
              
              {/* Item Total */}
              <div className="w-24 text-right">
                <span className="text-lg font-medium">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
              
              {/* Remove Button */}
              <button 
                onClick={() => handleRemoveItem(item.id)}
                className="ml-4 text-red-500 hover:text-red-400"
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-xl">Total:</span>
            <span className="text-2xl font-bold">₹{totalPrice.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between">
            <Link 
              to="/product" 
              className="inline-flex items-center text-gray-400 hover:text-white"
            >
              <FaArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
            
            <button 
              onClick={handleCheckoutClick}
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition duration-300"
            >
              Checkout
            </button>
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div 
            className={`bg-gray-800 rounded-xl w-full max-w-md transform transition-all duration-300 ${
              showCheckoutModal ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Order Summary</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>
              
              {orderSuccess ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheck className="text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Order Successful!</h3>
                  <p className="text-gray-400 mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-medium mb-4">Items</h3>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <div className="flex items-center">
                            <span className="text-gray-400 mr-2">{item.quantity}x</span>
                            <span className="truncate max-w-[200px]">{item.title}</span>
                          </div>
                          <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-700 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Subtotal:</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Shipping:</span>
                      <span>₹{shipping.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-400">Tax:</span>
                      <span>₹{taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                      <span>Total:</span>
                      <span>₹{orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handleConfirmOrder}
                    disabled={isProcessing}
                    className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-lg font-medium transition duration-300 flex items-center justify-center disabled:opacity-70"
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Confirm Order'
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;