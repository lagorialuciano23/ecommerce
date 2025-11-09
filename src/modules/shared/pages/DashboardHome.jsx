import { useState, useEffect } from 'react';
import { ordersService } from '../../orders/services/orderServices';
import { productsService } from '../../products/services/productsService';

export default function DashboardHome() {

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [responseOrders, responseProducts] = await Promise.all([
          ordersService.getAll(),
          productsService.getProducts()
        ])
        
        setOrders(responseOrders);
        console.log("Respuesta del servicio de ordenes:", responseOrders);
        setProducts(responseProducts);
        console.log("Respuesta del servicio de productos:", responseProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener ordenes:", error);
        console.error("Error al obtener productos:", error);
        setError(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="grid grid-rows-2 lg:grid-rows-3 gap-6">
      <div className="bg-blue-200 p-6 text-blue-900 rounded-xl shadow">Productos actuales: {products.length}</div>
      <div className="bg-green-200 p-6 text-green-900 rounded-xl shadow">Ordenes actuales:  {orders.length}</div>
      <div className="bg-orange-200 p-6 text-orange-900 rounded-xl shadow">Usuarios actuales: 0</div>
    </div>
  );
}