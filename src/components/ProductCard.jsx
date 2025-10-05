// src/components/ProductCard.js
import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [quantityInCart, setQuantityInCart] = useState(0);
  const [isInCart, setIsInCart] = useState(false);

  // Get cart items from Redux store
  const cart = useSelector((state) => state.cart.cart);

  // Check if product is in cart
  useEffect(() => {
    const item = cart.find(item => item.id === product.id);
    if (item) {
      setQuantityInCart(item.quantity);
      setIsInCart(true);
    } else {
      setQuantityInCart(0);
      setIsInCart(false);
    }
  }, [cart, product.id]);

  const handleAddToCart = () => {
    if (!isInCart) {
      setIsAdding(true);
      dispatch(addToCart(product));
      
      // Reset after animation
      setTimeout(() => setIsAdding(false), 1000);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
      <img 
        src={product.image} 
        alt={product.title} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-white font-medium mb-2 truncate">{product.title}</h3>
        <p className="text-gray-400 text-sm mb-3 h-12 overflow-hidden">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-teal-400 font-bold">₹{product.price.toFixed(2)}</span>
          <button 
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`p-2 rounded-full transition-all ${
              isInCart 
                ? 'bg-green-500 cursor-default' 
                : isAdding 
                  ? 'bg-green-500' 
                  : 'bg-teal-600 hover:bg-teal-700'
            }`}
          >
            {isInCart || isAdding ? (
              <FaCheck className="text-white" />
            ) : (
              <FaShoppingCart className="text-white" />
            )}
          </button>
        </div>
        {isInCart && (
          <div className="mt-2 text-xs text-green-400 text-center">
            {quantityInCart} {quantityInCart === 1 ? 'item' : 'items'} in cart
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;