import { useState, useEffect } from 'react';
import { ordersService } from '../../orders/services/orderServices';
import { productsService } from '../../products/services/productsService';
import StatCard from '../../shared/components/StatCard';

export default function DashboardHome() {

  const [summary, setSummary] = useState({
    Total: 0,
    Activos: 0,
    Inactivos: 0,
    BajoStock: 0,
  });

  const [ordersSummary, setOrdersSummary] = useState({
    TotalOrders: 0,
    PendingOrders: 0,
    ProcessingOrders: 0,
    ShippedOrders: 0,
    DeliveredOrders: 0,
    CancelledOrders: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseOrders, responseProducts] = await Promise.all([
          ordersService.getOrdersSummary(),
          productsService.getProductSummary(),
        ]);

        setOrdersSummary(responseOrders || {
          TotalOrders: 0,
          PendingOrders: 0,
          ProcessingOrders: 0,
          ShippedOrders: 0,
          DeliveredOrders: 0,
          CancelledOrders: 0
        });

        setSummary(responseProducts || {
          Total: 0,
          Activos: 0,
          Inactivos: 0,
          BajoStock: 0
        });

        console.log('Órdenes:', responseOrders);
        console.log('Resumen de productos:', responseProducts);
      } catch (error) {
        console.error('Error al obtener datos:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 bg-red-50 border border-red-200 rounded-lg max-w-md">
          <svg className="w-10 h-10 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-base font-semibold text-red-700 mb-1">Error al cargar el dashboard</p>
          <p className="text-sm text-red-600">{error.message || 'Error desconocido'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Sección products */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Productos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Productos totales" 
            value={summary.Total} 
            bgColor="bg-blue-200" 
            textColor="text-blue-900" 
          />
          <StatCard 
            title="Productos activos" 
            value={summary.Activos} 
            bgColor="bg-green-200" 
            textColor="text-green-900" 
          />
          <StatCard 
            title="Inactivos" 
            value={summary.Inactivos} 
            bgColor="bg-red-200" 
            textColor="text-red-900" 
          />
          <StatCard 
            title="Bajo stock" 
            value={summary.BajoStock} 
            bgColor="bg-yellow-200" 
            textColor="text-yellow-900" 
          />
        </div>
      </div>

      {/* Sección orders */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Órdenes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard 
            title="Órdenes totales" 
            value={ordersSummary.TotalOrders} 
            bgColor="bg-purple-200" 
            textColor="text-purple-900" 
          />
          <StatCard 
            title="Pendientes" 
            value={ordersSummary.PendingOrders} 
            bgColor="bg-yellow-200" 
            textColor="text-yellow-900" 
          />
          <StatCard 
            title="En proceso" 
            value={ordersSummary.ProcessingOrders} 
            bgColor="bg-blue-200" 
            textColor="text-blue-900" 
          />
          <StatCard 
            title="Enviadas" 
            value={ordersSummary.ShippedOrders} 
            bgColor="bg-indigo-200" 
            textColor="text-indigo-900" 
          />
          <StatCard 
            title="Entregadas" 
            value={ordersSummary.DeliveredOrders} 
            bgColor="bg-green-200" 
            textColor="text-green-900" 
          />
          <StatCard 
            title="Canceladas" 
            value={ordersSummary.CancelledOrders} 
            bgColor="bg-red-200" 
            textColor="text-red-900" 
          />
        </div>
      </div>
    </div>
  );
}