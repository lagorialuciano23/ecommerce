import Login from './modules/auth/pages/Login';
import './modules/auth/pages/login.css';
import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import ProductsPage from './modules/products/pages/ProductsPage.jsx';
import Dashboard from './modules/shared/pages/Dashboard.jsx';
import Error from './modules/products/pages/Error.jsx';

function App() {
  return (

    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="*" element={<Error />} />
        {/*Ruta default: si manda algo erroneo*/}
      </Routes>
    </BrowserRouter>

  );
}

export default App;
