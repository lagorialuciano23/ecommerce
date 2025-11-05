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
import PublicLayout from './modules/shared/pages/PublicLayout.jsx';
import CustomerProductsPage from './modules/products/pages/CustomersProductsPage.jsx';

function App() {
  return (
    <Routes>
      {/* --- RUTAS PÚBLICAS (con Layout Público) --- */}
      <Route path="/" element={<PublicLayout />}>
        {/* La ruta raíz ahora es la tienda de clientes */}
        <Route index element={<CustomerProductsPage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Register />} />
        <Route path="cart" element={<CartPage />} />
      </Route>

      {/* --- RUTAS PROTEGIDAS (con Layout de Admin) --- */}
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
      {/* --- RUTA 404 --- */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;