import Login from './modules/auth/pages/Login';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProductsPage from './modules/products/pages/ProductsPage.jsx';
import Dashboard from './modules/shared/pages/AdminLayout.jsx'; // Tu "esqueleto"
import NotFoundPage from './modules/shared/pages/NotFoundPage.jsx';
import { ProtectedRoute } from './modules/auth/helpers/ProtectedRoute.jsx';


// Importa la página de "Cards" que creamos
import DashboardHome from './modules/shared/pages/DashboardHome.jsx'; 
import AdminLayout from './modules/shared/pages/AdminLayout.jsx';

function App() {
  return (
    <Routes>
      {/* --- RUTAS PÚBLICAS --- */}
      <Route path='/' element={<Navigate to='/login' />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFoundPage />} />

      {/* --- RUTAS PROTEGIDAS (ANIDADAS) --- */}
      
      {/* 1. RUTA PADRE / LAYOUT */}
      {/* Esta es la ruta que coincide con tus links: /admin */}
      <Route
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout /> {/* Tu "Esqueleto" con el <Outlet /> */}
          </ProtectedRoute>
        }
      >
        {/* 2. RUTAS HIJAS (las que van en el <Outlet />) */}
        
        {/* 'index' se muestra en la URL exacta del padre (/admin) */}
        <Route index element={<DashboardHome />} /> 
        
        {/* 'path' se añade a la ruta padre (URL: /admin/products) */}
        <Route path="products" element={<ProductsPage />} />
        
        {/* (Aquí puedes agregar "orders", "users", etc.) */}
        {/* <Route path="orders" element={<OrdersPage />} /> */}
      </Route>

      {/* BORRAMOS las rutas antiguas de /dashboard y /products */}

    </Routes>
  );
}

export default App;