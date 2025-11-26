import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ordersService } from '../services/orderServices';
import Toast from '../../shared/components/Toast';
import ConfirmModal from '../../shared/components/ConfirmModal';

// Componente helper para mostrar un ítem
function OrderItem({ item }) {
  return (
    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div>
        <p className="font-semibold text-gray-800">{item.Name}</p>
        <p className="text-sm text-gray-500">ID Producto: {item.ProductId.substring(0, 8)}...</p>
      </div>
      <div className="text-right">
        <p className="text-gray-600">{item.Quantity} x ${item.UnitPrice.toFixed(2)}</p>
        <p className="font-semibold text-gray-900">${item.Subtotal.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteToast, setShowDeleteToast] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await ordersService.getById(id);
        setOrder(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    setError(null);
    try {
      await ordersService.updateStatus(order.Id, newStatus);
      setOrder(prevOrder => ({ ...prevOrder, Status: newStatus }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = () => {
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError(null);
    setIsConfirmModalOpen(false);

    try {
      await ordersService.delete(order.Id);
      setShowDeleteToast(true);
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  };

  const handleDeleteToastClose = () => {
    setShowDeleteToast(false);
    navigate('/admin/orders');
  };

  if (isLoading) {
    return <p className="text-center text-white">Cargando detalles de la orden...</p>;
  }

  if (error) {
    return <p className="text-center text-red-400">Error: {error}</p>;
  }

  if (!order) {
    return <p className="text-center text-white">No se encontró la orden.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4"> {/* ← Contenedor con ancho máximo */}
      
      {/* Botón Volver */}
      <div className="mb-6">
        <Link
          to="/admin/orders"
          className="inline-block bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm"
        >
          Volver a Órdenes
        </Link>
      </div>

      {/* Header con IDs y Estado */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow border border-gray-200 mb-6"> {/* ← Card con ancho completo */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          
          {/* IDs del lado izquierdo */}
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-500 flex-shrink-0">ID Orden:</span>
              <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded break-all">
                {order.Id}
              </code>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-500 flex-shrink-0">Cliente ID:</span>
              <code className="text-sm font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded break-all">
                {order.CustomerId}
              </code>
            </div>
          </div>

          {/* Estado y Fecha del lado derecho */}
          <div className="flex flex-col items-end gap-3 flex-shrink-0">
            {/* Select de Estado */}
            <select
              value={order.Status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={isUpdating || isDeleting}
              className={`text-sm font-medium px-3 py-2 rounded-full border ${
                order.Status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                order.Status === 'PROCESSING' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                order.Status === 'SHIPPED' ? 'bg-indigo-100 text-indigo-800 border-indigo-200' :
                order.Status === 'DELIVERED' ? 'bg-green-100 text-green-800 border-green-200' :
                'bg-red-100 text-red-800 border-red-200'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer disabled:opacity-50`}
            >
              <option value="PENDING" className="bg-white">Pendiente</option>
              <option value="PROCESSING" className="bg-white">En Proceso</option>
              <option value="SHIPPED" className="bg-white">Enviado</option>
              <option value="DELIVERED" className="bg-white">Entregado</option>
              <option value="CANCELLED" className="bg-white">Cancelado</option>
            </select>

            {/* Fecha */}
            <div className="text-right">
              <p className="text-xs text-gray-500">Fecha de la orden:</p>
              <p className="text-sm font-medium text-gray-900">
                {order.Date ? new Date(order.Date).toLocaleDateString('es-AR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grilla de Detalles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Columna Izquierda (Items) */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow border border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Items ({order.Items.length})</h2>
          <div className="space-y-3">
            {order.Items.map(item => (
              <OrderItem key={item.ProductId} item={item} />
            ))}
          </div>
        </div>

        {/* Columna Derecha (Info) */}
        <div className="space-y-6">
          {/* Total */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Total</h2>
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${order.TotalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envío:</span>
              <span>$0.00</span>
            </div>
            <div className="flex justify-between text-gray-900 font-bold text-lg mt-2 pt-2 border-t border-gray-200">
              <span>Total:</span>
              <span>${order.TotalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Direcciones */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Direcciones</h2>
            <h3 className="font-semibold text-gray-700">Envío:</h3>
            <p className="text-gray-600 mb-3">{order.ShippingAddress}</p>
            <h3 className="font-semibold text-gray-700">Facturación:</h3>
            <p className="text-gray-600">{order.BillingAddress}</p>
          </div>

          {/* Acciones Admin */}
          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Acciones de Admin</h2>
            <button
              onClick={handleDelete}
              disabled={isDeleting || isUpdating}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Orden'}
            </button>
            {error && (
              <p className="text-center text-red-600 mt-4 text-sm">{error}</p>
            )}
          </div>
        </div>
      </div>

      <Toast
        open={showDeleteToast}
        title="¡Orden Eliminada!"
        message="La orden ha sido eliminada y el stock repuesto."
        onClose={handleDeleteToastClose}
        duration={2000}
      />
      
      <ConfirmModal
        open={isConfirmModalOpen}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar esta orden? Esta acción no se puede deshacer y repondrá el stock de los productos."
        confirmText="Eliminar"
        isConfirming={isDeleting}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}