import Login from './modules/auth/pages/Login';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductsPage from './modules/products/pages/ProductsPage.jsx';
import NotFoundPage from './modules/shared/pages/NotFoundPage.jsx';
import { ProtectedRoute } from './modules/auth/helpers/ProtectedRoute.jsx';
import DashboardHome from './modules/shared/pages/DashboardHome.jsx';
import AdminLayout from './modules/shared/pages/AdminLayout.jsx';
import Register from './modules/auth/pages/Register';
import OrdersPage from './modules/orders/pages/OrdersPage.jsx';
import CartPage from './modules/cart/pages/CartPage.jsx';
import ProductCreatePage from './modules/products/pages/ProductCreatePage.jsx';

function App() {
  return (
    <Routes>
      {/* --- RUTAS PÚBLICAS --- */}
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />
      <Route path="*" element={<NotFoundPage />} />
      <Route path="/cart" element={<CartPage />} />

      {/* --- RUTAS PROTEGIDAS (ADMIN) --- */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/create" element={<ProductCreatePage />} />
        <Route path="orders" element={<OrdersPage />} />
      </Route>
    </Routes>
  );
}

export default App;