import Login from './modules/auth/pages/Login';
import './modules/auth/pages/login.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductsPage from './modules/products/pages/ProductsPage.jsx';
import Dashboard from './modules/shared/pages/Dashboard.jsx';
import NotFoundPage from './modules/shared/pages/NotFoundPage.jsx';
import { ProtectedRoute } from './modules/auth/helpers/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      {/*Rutas publicas*/}
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFoundPage />} />
      {/* Rutas Protegidas: Solo se renderizarán si isLoggedIn es true.
        De lo contrario, ProtectedRoute redirigirá a /login.
      */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
