import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { ShopProvider } from './context/ShopContext';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';


function App() {
  const [count, setCount] = useState(0)

  return (
    <ShopProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage/>} />
        <Route path='/product' element={<ProductPage/>} />
        <Route path='/cart' element={<CartPage/>}/>
      </Routes>
    </BrowserRouter>
    </ShopProvider>
  )
}

export default App
