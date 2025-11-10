import { useState, useEffect } from 'react';
import { ordersService } from '../../orders/services/orderServices';
import { productsService } from '../../products/services/productsService';

export default function DashboardHome() {

  const [summary, setSummary] = useState({
    total: 0,
    activos: 0,
    inactivos: 0,
    bajoStock: 0
  });

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseOrders, responseProducts] = await Promise.all([
          ordersService.getAll(),
          productsService.getProductSummary()
        ]);

        setOrders(responseOrders || []); // depende de cómo lo devuelva tu servicio
        setSummary(responseProducts || { total: 0, activos: 0, inactivos: 0, bajoStock: 0 });

        console.log("Ordenes:", responseOrders);
        console.log("Resumen de productos:", responseProducts);
      } catch (error) {
        console.error("Error al obtener datos:", error);
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
      <div className="bg-blue-200 p-6 text-blue-900 rounded-xl shadow">
        Productos totales: {summary.Total}
      </div>
      <div className="bg-green-200 p-6 text-green-900 rounded-xl shadow">
        Productos activos: {summary.Activos}
      </div>
      <div className="bg-red-200 p-6 text-red-900 rounded-xl shadow">
        Inactivos: {summary.Inactivos}
      </div>
      <div className="bg-yellow-200 p-6 text-yellow-900 rounded-xl shadow">
        Bajo stock: {summary.BajoStock}
      </div>  
      <div className="bg-orange-200 p-6 text-orange-900 rounded-xl shadow md:col-span-4">
        Órdenes actuales: {orders.length}
      </div>
    </div>
  );
}
