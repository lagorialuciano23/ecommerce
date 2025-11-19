import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCart } from '../context/useCart';
import { useAuth } from '../../auth/context/useAuth';
import { ordersService } from '../../orders/services/orderServices';

import AuthInput from '../../auth/components/Input';
import AuthSubmitButton from '../../auth/components/Button';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal'; // Importamos la modal de registro
import Toast from '../../shared/components/Toast';

// Componente simple para el item del carrito
function CartItem({ item, removeFromCart }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
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
  // ---  HOOKS ---
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();
  const { isLoggedIn, user } = useAuth(); // Corregido: 'user' no se usaba
  const navigate = useNavigate();

  // Estados de UI
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false); // Estado para la modal de registro
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showAuthToast, setShowAuthToast] = useState(false);

  // Formulario para las direcciones
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  // Definimos costos
  const shippingCost = 0.00; // Lo ponemos en 0 por ahora
  const finalTotal = cartTotal + shippingCost; // Corregido: esta variable ahora se usa

  // Verificar Auth al clickear los campos
  const handleAuthCheck = (e) => {
    if (!isLoggedIn) {
      // 1. Quitamos el foco para que el usuario no pueda escribir
      e.target.blur();
      // 2. Abrimos el modal de login
      setIsModalOpen(true);
      // 3. Mostramos el Toast de advertencia
      setShowAuthToast(true);
    }
  };
  // ---  LÓGICA DE ENVÍO DE ORDEN ---
  const submitOrder = async (formData) => {
    setIsLoading(true);
    setApiError(null);

    const customerId = user.Id;

    const orderItemsPayload = cartItems.map(item => ({
      ProductId: item.id,
      Quantity: item.quantity,
    }));

    const orderPayload = {
      CustomerId: customerId,
      ShippingAddress: formData.shippingAddress,
      BillingAddress: formData.billingAddress,
      OrderItems: orderItemsPayload,
      Notes: formData.notes || '',
    };

    try {
      await ordersService.create(orderPayload);
      clearCart();
      setShowSuccessToast(true);
    } catch (error) {
      console.error('Error al crear la orden:', error);
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalizePurchase = (formData) => {
    if (!isLoggedIn) {
      setIsModalOpen(true);
      setShowAuthToast(true);
    } else {
      submitOrder(formData);
    }
  };

  const handleToastClose = () => {
    setShowSuccessToast(false);
    navigate('/'); // Redirige a la pagina principal
  };

  // --- Handlers para las Modales ---
  const handleLoginSuccess = () => {
    setIsModalOpen(false);
    handleSubmit(submitOrder)(); // Llama a submitOrder con los datos del form
  };

  const handleRegisterSuccess = () => {
    setIsRegisterModalOpen(false);
    setIsModalOpen(true); // Abre el login después de registrarse
  };

  return (
    <>
      {/* Corregido: Quitamos 'bg-gray-100' para tener fondo blanco uniforme */}
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">

          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Tu Carrito de Compras</h1>
            <Link
              to="/"
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

              {/* --- Formulario de Direcciones --- */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Datos de Envío</h2>
                {/*INPUTS CON PROTECCIÓN onFocus*/}
                <AuthInput
                  label="Dirección de Envío"
                  id="shippingAddress"
                  name="shippingAddress"
                  register={register}
                  errors={errors}
                  validationRules={{ required: 'La dirección de envío es obligatoria' }}
                  labelClassName="text-gray-800"
                  onFocus={handleAuthCheck}
                />
                <AuthInput
                  label="Dirección de Facturación"
                  id="billingAddress"
                  name="billingAddress"
                  register={register}
                  errors={errors}
                  validationRules={{ required: 'La dirección de facturación es obligatoria' }}
                  labelClassName="text-gray-800"
                  onFocus={handleAuthCheck}
                />
                <div>
                  <label htmlFor="notes" className="block text-gray-800 mb-2">Notas (Opcional)</label>
                  <textarea
                    id="notes"
                    {...register('notes')}
                    className="w-full p-2 rounded-lg bg-gray-100 text-black border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="2"
                    onFocus={handleAuthCheck}
                  ></textarea>
                </div>
              </div>

              {/* --- Resumen y Total (Corregido: Mostrando el total) --- */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
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
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                {apiError && (
                  <p className='text-red-600 p-2 bg-red-100 rounded-lg text-center text-sm mb-4'>
                    {apiError}
                  </p>
                )}

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={clearCart}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Vaciar Carrito
                  </button>
                  <AuthSubmitButton
                    isLoading={isLoading}
                    isValid={isValid && cartItems.length > 0}
                    text="Finalizar Compra"
                    // Estilo morado para el botón principal
                    className="cursor-pointer bg-purple-600 text-white rounded-lg p-2.5 transition-colors duration-200 hover:bg-purple-700 disabled:bg-gray-300"
                  />
                </div>
              </div>
            </form>
          ) : (
            <p className="text-center text-gray-600">Tu carrito está vacío.</p>
          )}

        </div>
      </div>

      {/* --- MODALES --- */}
      <LoginModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        footer={
          <div className="text-center text-sm text-gray-600 mt-4">
            ¿No tenés cuenta?{' '}
            <button
              type="button"
              onClick={() => { setIsModalOpen(false); setIsRegisterModalOpen(true); }}
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Registrate
            </button>
          </div>
        }
      />

      <RegisterModal
        open={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
        footer={
          <div className="text-center text-sm text-gray-600 mt-4">
            ¿Ya tenés cuenta?{' '}
            <button
              type="button"
              onClick={() => { setIsRegisterModalOpen(false); setIsModalOpen(true); }}
              className="font-medium text-purple-600 hover:text-purple-500"
            >
              Inicia Sesión
            </button>
          </div>
        }
      />
      {/* --- Toast de Exito --- */}
      <Toast
        open={showSuccessToast}
        title="¡Compra Exitosa!"
        message="Tu orden ha sido creada."
        onClose={handleToastClose}
      />
      {/* Toast de Advertencia de Login */}
      <Toast
        open={showAuthToast}
        title="ATENCIÓN"
        message="DEBES INICIAR SESION O REGISTRARTE PARA FINALIZAR LA COMPRA"
        onClose={() => setShowAuthToast(false)}
        duration={4000}
      />
    </>
  );
}