import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../context/useCart';
import { useAuth } from '../../auth/context/useAuth';
import { ordersService } from '../../orders/services/orderServices';

import AuthInput from '../../auth/components/Input';
import AuthSubmitButton from '../../auth/components/Button';
import LoginModal from '../components/LoginModal';
import Toast from '../../shared/components/Toast';

// Componente simple para el item del carrito
function CartItem({ item, removeFromCart }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Quitar
        </button>
      </div>
    </div>
  );
}

// Página principal del carrito
export default function CartPage() {
  // --- 1. HOOKS ---
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();
  const { isLoggedIn } = useAuth(); // Hook de autenticación
  const navigate = useNavigate();

  // Estados de UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Formulario para las direcciones
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  // 2. Definimos costos (pueden venir del backend más adelante)
  const shippingCost = 8000.00;
  const finalTotal = cartTotal + shippingCost;

  // --- 2. LÓGICA DE ENVÍO DE ORDEN ---

  /**
   * Esta es la función final que se llama cuando el usuario
   * está (o acaba de) loguearse.
   */
  const submitOrder = async (formData) => {
    setIsLoading(true);
    setApiError(null);

    // --- A. Preparar el Payload para el Backend ---

    // (NOTA: El backend necesita un CustomerId.
    // Como tu login de Auth no devuelve un CustomerId,
    // usaremos uno harcodeado de tu 'customers.json'
    // ¡Esto debe ser corregido en el backend a futuro!)
    const customerId = 'a1111111-aaaa-1111-aaaa-111111111111'; // ID de Francisco Vicente

    // Mapeamos los items del carrito al formato del DTO del backend
    const orderItemsPayload = cartItems.map(item => ({
      ProductId: item.id,
      Quantity: item.quantity,
    }));

    // Creamos el payload final de la orden
    const orderPayload = {
      CustomerId: customerId,
      ShippingAddress: formData.shippingAddress,
      BillingAddress: formData.billingAddress,
      OrderItems: orderItemsPayload,
      Notes: formData.notes || '',
    };

    // --- B. Llamar a la API ---
    try {
      await ordersService.create(orderPayload);

      // ¡Éxito!
      clearCart();
      setShowSuccessToast(true);
      // (La redirección ocurrirá cuando se cierre el toast)

    } catch (error) {
      console.error('Error al crear la orden:', error);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Esta función se llama al presionar "Finalizar Compra".
   * Decide si abre la modal o envía la orden.
   */
  const handleFinalizePurchase = (formData) => {
    // formData solo tiene { shippingAddress, billingAddress, notes }
    if (!isLoggedIn) {
      // Si no está logueado, abre la modal
      setIsModalOpen(true);
    } else {
      // Si está logueado, envía la orden
      submitOrder(formData);
    }
  };
  const handleToastClose = () => {
    setShowSuccessToast(false);
    navigate('/'); // Redirige a la pagina principal
  };

  return (
    <>
      <div className="bg-gray-100 min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Tu Carrito de Compras</h1>
            <Link
              to="/" //a la tienda principal
              className="text-blue-600 hover:text-blue-800"
            >
              &larr; Seguir comprando
            </Link>
          </div>

          {/* --- Items y Formulario --- */}
          {cartItems.length > 0 ? (
            <form onSubmit={handleSubmit(handleFinalizePurchase)}>
              {/* --- Lista de Items --- */}
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <CartItem key={item.id} item={item} removeFromCart={removeFromCart} />
                ))}
              </div>

              {/* --- Formulario de Direcciones (Requerido por Backend) --- */}
              <div className="bg-white p-6 rounded-lg shadow-sm mb-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Datos de Envío</h2>

                {/* Reutilizamos AuthInput pero con fondo blanco */}
                <AuthInput
                  label="Dirección de Envío"
                  id="shippingAddress"
                  name="shippingAddress"
                  register={register}
                  errors={errors}
                  validationRules={{ required: 'La dirección de envío es obligatoria' }}
                  labelClassName="text-gray-800" // Pasamos el color oscuro
                />

                <AuthInput
                  label="Dirección de Facturación"
                  id="billingAddress"
                  name="billingAddress"
                  register={register}
                  errors={errors}
                  validationRules={{ required: 'La dirección de facturación es obligatoria' }}
                  labelClassName="text-gray-800" // Pasamos el color oscuro
                />

                <div>
                  <label htmlFor="notes" className="block text-gray-800 mb-2">Notas (Opcional)</label>
                  <textarea
                    id="notes"
                    {...register('notes')}
                    className="w-full p-2 rounded-lg bg-gray-100 text-black border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  ></textarea>
                </div>
              </div>

              {/* --- Resumen y Total --- */}
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Sumario de Orden</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span>${finalTotal.toFixed(2)}</span> {/* <-- Aquí usamos finalTotal */}
                  </div>
                </div>

                {apiError && (
                  <p className='text-red-600 p-2 bg-red-100 rounded-lg text-center text-sm mb-4'>
                    {apiError}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <button
                    type="button" // Evita que envíe el formulario
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Vaciar Carrito
                  </button>
                  <AuthSubmitButton
                    isLoading={isLoading}
                    isValid={isValid && cartItems.length > 0}
                    text="Finalizar Compra"
                  />
                </div>
              </div>
            </form>
          ) : (
            <p className="text-center text-gray-600">Tu carrito está vacío.</p>
          )}

        </div>
      </div>

      {/* --- 4. MODAL Y TOASTS --- */}

      {isModalOpen && (
        <LoginModal
          onClose={() => setIsModalOpen(false)}
          // Al loguearse con éxito, se ejecuta el submit con los datos del form
          onLoginSuccess={handleSubmit(submitOrder)}
        />
      )}

      <Toast
        open={showSuccessToast}
        title="¡Compra Exitosa!"
        message="Tu orden ha sido creada."
        onClose={handleToastClose}
      />
    </>
  );
}