import { useState, useEffect } from 'react';
import {
  Package,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ClipboardList,
  Clock,
  RefreshCw,
  Send,
  PackageCheck,
  Ban,
} from 'lucide-react';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

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
          CancelledOrders: 0,
        });

        setSummary(responseProducts || {
          Total: 0,
          Activos: 0,
          Inactivos: 0,
          BajoStock: 0,
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

  // Preparamos los datos para el gráfico
  const chartData = [
    { name: 'Pendientes', cantidad: ordersSummary.PendingOrders, color: '#FBBF24' }, // Amarillo
    { name: 'En Proceso', cantidad: ordersSummary.ProcessingOrders, color: '#3B82F6' }, // Azul
    { name: 'Enviadas', cantidad: ordersSummary.ShippedOrders, color: '#6366F1' },   // Indigo
    { name: 'Entregadas', cantidad: ordersSummary.DeliveredOrders, color: '#10B981' }, // Verde
    { name: 'Canceladas', cantidad: ordersSummary.CancelledOrders, color: '#EF4444' }, // Rojo
  ];

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
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Productos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Productos totales"
            value={summary.Total}
            bgColor="bg-blue-200"
            textColor="text-blue-900"
            icon={Package}
          />
          <StatCard
            title="Productos activos"
            value={summary.Activos}
            bgColor="bg-green-200"
            textColor="text-green-900"
            icon={CheckCircle}
          />
          <StatCard
            title="Inactivos"
            value={summary.Inactivos}
            bgColor="bg-red-200"
            textColor="text-red-900"
            icon={XCircle}
          />
          <StatCard
            title="Bajo stock"
            value={summary.BajoStock}
            bgColor="bg-yellow-200"
            textColor="text-yellow-900"
            icon={AlertTriangle}
          />
        </div>
      </div>

      {/* Sección orders + Grafico */}
      <div className="mb-8 bg-white p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Órdenes</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Órdenes totales"
            value={ordersSummary.TotalOrders}
            bgColor="bg-purple-200"
            textColor="text-purple-900"
            icon={ClipboardList}
          />
          <StatCard
            title="Pendientes"
            value={ordersSummary.PendingOrders}
            bgColor="bg-yellow-200"
            textColor="text-yellow-900"
            icon={Clock}
          />
          <StatCard
            title="En proceso"
            value={ordersSummary.ProcessingOrders}
            bgColor="bg-blue-200"
            textColor="text-blue-900"
            icon={RefreshCw}
          />
          <StatCard
            title="Enviadas"
            value={ordersSummary.ShippedOrders}
            bgColor="bg-indigo-200"
            textColor="text-indigo-900"
            icon={Send}
          />
          <StatCard
            title="Entregadas"
            value={ordersSummary.DeliveredOrders}
            bgColor="bg-green-200"
            textColor="text-green-900"
            icon={PackageCheck}
          />
          <StatCard
            title="Canceladas"
            value={ordersSummary.CancelledOrders}
            bgColor="bg-red-200"
            textColor="text-red-900"
            icon={Ban}
          />
        </div>
      </div>

      <div className="w-full h-[400px] mt-8 mb-8 bg-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">Estado de las Órdenes</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 40,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} /> {/* allowDecimals={false} para que no muestre 1.5 ordenes */}
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            />
            <Legend />
            <Bar dataKey="cantidad" name="Cantidad de Órdenes" radius={[4, 4, 0, 0]}>
              {
                chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))
              }
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}