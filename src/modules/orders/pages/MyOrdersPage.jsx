import { useState, useEffect } from 'react';
import { ordersService } from '../services/orderServices';
import { Link } from 'react-router-dom';
import { Package, Calendar } from 'lucide-react';

// Diccionario de traducciones para los estados
const statusTranslations = {
  'PENDING': 'Pendiente',
  'PROCESSING': 'En Proceso',
  'SHIPPED': 'Enviado',
  'DELIVERED': 'Entregado',
  'CANCELLED': 'Cancelado',
};

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
    <div className="max-w-6xl mx-auto px-4">
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
            <div key={order.Id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">

              {/* header: estado y fecha */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.Status)}`}>
                  {statusTranslations[order.Status] || order.Status}
                </span>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(order.Date).toLocaleDateString()}
                </span>
              </div>

              {/* Contenido */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/*  col 1: ID y Resumen*/}
                <div className="lg:col-span-1">
                  <p className="font-semibold text-gray-900 mb-2">
                    ID de la orden: #{order.Id}
                  </p>
                  <p className="text-base text-gray-600">
                    {order.Items.length} {order.Items.length === 1 ? 'producto' : 'productos'}
                  </p>
                  <p className="text-base text-gray-600 mt-1">
                    Total de la orden : <span className="font-bold text-lg text-gray-600">${order.TotalAmount.toFixed(2)}</span>
                  </p>
                </div>

                {/* col 2-3: lista de Productos */}
                <div className="lg:col-span-2">
                  <h4 className="text-base font-bold text-gray-900 mb-2">Productos comprados:</h4>
                  <ul className="space-y-2">
                    {order.Items.map((item, index) => (
                      <li key={index} className="flex justify-between text-base items-center bg-gray-50 p-3 rounded">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="font-medium text-gray-900 flex-shrink-0">{item.Quantity}x</span>
                          <span className="text-gray-700 truncate">{item.Name}</span>
                        </div>
                        <span className="text-gray-600 font-semibold ml-4 flex-shrink-0">
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