import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './modules/auth/context/AuthProvider';
import { CartProvider } from './modules/cart/context/CartProvider';

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <CartProvider>
      <StrictMode>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </StrictMode>,
    </CartProvider>
  </AuthProvider>,
);
