import { useState, useEffect } from 'react';
import { ordersService } from '../../orders/services/orderServices';
import { productsService } from '../../products/services/productsService';
import StatCard from '../../shared/components/StatCard';

export default function DashboardHome() {

  const [summary, setSummary] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    bajoStock: 0,
  });

  const [ordersSummary, setOrdersSummary] = useState({
    total: 0,
    totalPending: 0,
    totalProcessing: 0,
    totalShipped: 0,
    totalDelivered: 0,
    totalCancelled: 0,
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseOrders, responseProducts] = await Promise.all([
          ordersService.getOrdersSummary(),
          productsService.getProductSummary(),
        ]);

        setOrdersSummary(responseOrders || { total: 0, totalPending: 0, totalProcessing: 0, totalShipped: 0, totalDelivered: 0, totalCancelled: 0 }); // depende de cómo lo devuelva tu servicio
        setSummary(responseProducts || { total: 0, activos: 0, inactivos: 0, bajoStock: 0 });

        console.log('Ordenes:', responseOrders);
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

  if (loading) return <p>Cargando...</p>;

  if (error) return <p>Error al cargar el dashboard.</p>;

  return (
    <div className="grid md:grid-cols-4 gap-6">
      <StatCard title="Productos totales" value={summary.Total} bgColor="bg-blue-200" textColor="text-blue-900" />
      <StatCard title="Productos activos" value={summary.Activos} bgColor="bg-green-200" textColor="text-green-900" />
      <StatCard title="Inactivos" value={summary.Inactivos} bgColor="bg-red-200" textColor="text-red-900" />
      <StatCard title="Bajo stock" value={summary.BajoStock} bgColor="bg-yellow-200" textColor="text-yellow-900" />
      <StatCard title="Órdenes actuales" value={ordersSummary.TotalOrders} bgColor="bg-orange-200" textColor="text-orange-900" />
      <StatCard title="Órdenes pendientes" value={ordersSummary.PendingOrders} bgColor="bg-orange-200" textColor="text-orange-900" />
      <StatCard title="Órdenes en proceso" value={ordersSummary.ProcessingOrders} bgColor="bg-orange-200" textColor="text-orange-900" />
      <StatCard title="Órdenes enviadas" value={ordersSummary.ShippedOrders} bgColor="bg-orange-200" textColor="text-orange-900" />
      <StatCard title="Órdenes entregadas" value={ordersSummary.DeliveredOrders} bgColor="bg-orange-200" textColor="text-orange-900" />
      <StatCard title="Órdenes canceladas" value={ordersSummary.CancelledOrders} bgColor="bg-orange-200" textColor="text-orange-900" />
    </div>
  );
}
