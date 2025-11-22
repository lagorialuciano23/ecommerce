import Login from './modules/auth/pages/Login';
import { Routes, Route } from 'react-router-dom';
import ProductsPage from './modules/products/pages/ProductsPage.jsx';
import NotFoundPage from './modules/shared/pages/NotFoundPage.jsx';
import { ProtectedRoute } from './modules/auth/helpers/ProtectedRoute.jsx';
import { UserProtectedRoute } from './modules/auth/helpers/UserProtectedRoute';
import { PublicOnlyRoute } from './modules/auth/helpers/PublicOnlyRoute.jsx'; // ✅ NUEVO
import DashboardHome from './modules/shared/pages/DashboardHome.jsx';
import AdminLayout from './modules/shared/pages/AdminLayout.jsx';
import Register from './modules/auth/pages/Register';
import OrdersPage from './modules/orders/pages/OrdersPage.jsx';
import CartPage from './modules/cart/pages/CartPage.jsx';
import PublicLayout from './modules/shared/pages/PublicLayout.jsx';
import CustomerProductsPage from './modules/products/pages/CustomersProductsPage.jsx';
import CreateProductsPage from './modules/products/pages/CreateProductsPage.jsx';
import EditProductPage from './modules/products/pages/EditProductPage.jsx';
import OrdersDetailPage from './modules/orders/pages/OrdersDetailPage.jsx';
import ProductDetailPage from './modules/products/pages/ProductDetailPage.jsx';
import MyOrdersPage from './modules/orders/pages/MyOrdersPage.jsx';

function App() {
  return (
    <Routes>
      {/* ========== RUTAS PÚBLICAS (Solo para clientes y visitantes) ========== */}
      <Route 
        path="/" 
        element={
          <PublicOnlyRoute>
            <PublicLayout />
          </PublicOnlyRoute>
        }
      >
        <Route index element={<CustomerProductsPage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        
        {/* Ruta protegida para usuarios logueados (solo User) */}
        <Route
          path="my-orders"
          element={
            <UserProtectedRoute allowedRoles={['User']}>
              <MyOrdersPage />
            </UserProtectedRoute>
          }
        />
      </Route>

      {/* ========== RUTAS DE AUTENTICACIÓN (sin layout) ========== */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Register />} />

      {/* ========== RUTAS ADMIN (Solo para Admin) ========== */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['Admin']} redirectPath="/">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/create" element={<CreateProductsPage />} />
        <Route path="products/edit/:id" element={<EditProductPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="orders/:id" element={<OrdersDetailPage />} />
      </Route>

      {/* ========== 404 ========== */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;