import { useState, useEffect } from 'react';
import { ordersService } from '../services/orderServices';
import { Link } from 'react-router-dom';
import { Package, Calendar, ChevronRight } from 'lucide-react';

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        const response = await ordersService.getMyOrders();

        // --- AGREGAR ESTE LOG ---
        console.log('Respuesta de Mis Compras:', response);
        setOrders(response.Items || []);
      } catch (error) {
        console.error('Error cargando mis órdenes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'PROCESSING': 'bg-blue-100 text-blue-800',
      'SHIPPED': 'bg-purple-100 text-purple-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
    };

    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Compras</h1>

      {isLoading ? (
        <p className="text-center text-gray-500">Cargando tu historial...</p>
      ) : orders.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">Aún no has realizado ninguna compra.</p>
          <Link to="/" className="text-purple-600 hover:underline mt-2 block">
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.Id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">

                {/* Info Izquierda */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.Status)}`}>
                      {order.Status}
                    </span>
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(order.Date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-semibold text-gray-900">Orden #{order.Id.substring(0, 8)}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.Items.length} {order.Items.length === 1 ? 'producto' : 'productos'}
                    <span className="mx-2">•</span>
                    Total: <span className="font-bold">${order.TotalAmount.toFixed(2)}</span>
                  </p>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-2">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Productos:</h4>
                  <ul className="space-y-2">
                    {order.Items.map((item, index) => (
                      <li key={index} className="flex justify-between text-sm items-center bg-gray-50 p-2 rounded">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{item.Quantity}x</span>
                          <span className="text-gray-700">{item.Name}</span>
                        </div>
                        <span className="text-gray-600 font-medium">
                        ${item.Subtotal.toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}