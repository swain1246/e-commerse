// ProductCard.js
import React, { useState } from 'react';
import { FaShoppingCart, FaCheck } from 'react-icons/fa';
import { useShop } from '../context/ShopContext';

const ProductCard = ({ product }) => {
  const { addToCart, getProductQuantity } = useShop();
  const [isAdding, setIsAdding] = useState(false);
  
  // Check if product is already in cart
  const quantityInCart = getProductQuantity(product.id);
  const isInCart = quantityInCart > 0;

  const handleAddToCart = () => {
    if (!isInCart) {
      setIsAdding(true);
      addToCart(product);
      
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
          <span className="text-teal-400 font-bold">${product.price.toFixed(2)}</span>
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