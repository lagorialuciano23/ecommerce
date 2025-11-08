import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ordersService } from '../services/orderServices';
import Toast from '../../shared/components/Toast';
import ConfirmModal from '../../shared/components/ConfirmModal';

// Componente helper para mostrar un ítem
function OrderItem({ item }) {
  return (
    <div className="flex justify-between items-center py-3 px-4 bg-white rounded-lg border border-gray-200 shadow-sm"> {/* <-- CLASES CAMBIADAS */}
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
  const { id } = useParams(); // Obtiene el ID de la URL
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // Nuevos estados para los botones
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

        setOrder(response); // La respuesta ya es el objeto de la orden
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [id]); // Se ejecuta cada vez que el ID de la URL cambia

  // --- 4. NUEVOS HANDLERS ---

  /**
   * Manejador para cambiar el estado de la orden (Modificar)
   */
  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    setError(null);
    try {
      // El servicio 'updateStatus' ya existe
      await ordersService.updateStatus(order.Id, newStatus);
      // Actualizamos el estado local para ver el cambio instantáneamente
      setOrder(prevOrder => ({ ...prevOrder, Status: newStatus }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  /**
   * Manejador para INICIAR el borrado (abre la modal)
   */
  const handleDelete = () => {
    // 3. Ya no usamos window.confirm, solo abrimos la modal
    setIsConfirmModalOpen(true);
  };

  /**
   * Manejador para CONFIRMAR el borrado (se llama desde la modal)
   */
  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError(null);
    setIsConfirmModalOpen(false); // Cerramos la modal

    try {
      await ordersService.delete(order.Id);
      // Mostramos el toast de éxito
      setShowDeleteToast(true);
    } catch (err) {
      setError(err.message);
      setIsDeleting(false); // Si hay error, reactivamos los botones
    }
  };

  // --- 4. AÑADIR HANDLER PARA CERRAR EL TOAST ---
  /**
   * Se llama cuando el toast se cierra.
   * Cierra el toast y navega a la lista de órdenes.
   */
  const handleDeleteToastClose = () => {
    setShowDeleteToast(false);
    navigate('/admin/orders'); // <-- Navegamos DESPUÉS de cerrar el toast
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

  // Si todo está bien, renderizamos los detalles
  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <Link
          to="/admin/orders"
          className="text-purple-600 hover:text-purple-800"
        >
          &larr; Volver a Órdenes
        </Link>
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          {/* Título de la Orden*/}
          <h1 className="text-3xl font-bold text-gray-900">Orden #{order.Id.substring(0, 8)}...</h1>
          <p className="text-gray-500">Cliente ID: {order.CustomerId.substring(0, 8)}...</p>
        </div>
        <div className="text-right">
          {/* Status (Corregido - ahora espera "PENDING") */}
          <select
            value={order.Status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating || isDeleting}
            className={`text-lg font-medium px-3 py-1 rounded-full border ${
              order.Status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                order.Status === 'DELIVERED' ? 'bg-green-100 text-green-800 border-green-200' :
                  order.Status === 'CANCELLED' ? 'bg-red-100 text-red-800 border-red-200' :
                    'bg-blue-100 text-blue-800 border-blue-200'
            } focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer disabled:opacity-50`}
          >
            <option value="PENDING">PENDING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
          <p className="text-gray-500 mt-2">
            {new Date(order.Date).toLocaleDateString()}
          </p>
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

          <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">Acciones de Admin</h2>
            <button
              onClick={handleDelete} // Este botón ahora solo abre la modal
              disabled={isDeleting || isUpdating}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar Orden'}
            </button>
            {error && (
              <p className="text-center text-red-600 mt-4">{error}</p>
            )}
          </div>
        </div>
      </div>
      <Toast
        open={showDeleteToast}
        title="¡Orden Eliminada!"
        message="La orden ha sido eliminada y el stock repuesto."
        onClose={handleDeleteToastClose}
        duration={2000} // Duración corta, ya que redirigimos
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