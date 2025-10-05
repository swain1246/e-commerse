// ProductPage.js
import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';

const ProductPage = () => {
  const { currentUser, cartCount, logout } = useShop();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=12');
        const data = await response.json();
        
        // Transform to product format
        const transformedProducts = data.map(item => ({
          id: item.id,
          title: item.title,
          description: item.body.substring(0, 80) + '...',
          price: Math.floor(Math.random() * 100) + 10,
          image: `https://picsum.photos/seed/${item.id}/300/200.jpg`
        }));
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 bg-gray-800 shadow-md z-10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <FaShoppingCart className="text-teal-400 text-2xl mr-2" />
            <h1 className="text-2xl font-bold">ShopHub</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative cursor-pointer" onClick={handleCartClick}>
              <FaShoppingCart className="text-xl" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-teal-500 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-300 hover:text-white"
            >
              <FaSignOutAlt className="mr-1" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Welcome, {currentUser?.fullName || 'User'}!
          </h2>
          <p className="text-gray-400">Explore our products</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-2">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 border-t border-gray-700">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">© 2023 ShopHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;