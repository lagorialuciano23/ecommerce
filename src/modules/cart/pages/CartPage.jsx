import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useSpring, animated, useTransition, config } from '@react-spring/web';
import { useCart } from '../context/useCart';
import { useAuth } from '../../auth/context/useAuth';
import { ordersService } from '../../orders/services/orderServices';

import AuthInput from '../../auth/components/Input';
import AuthSubmitButton from '../../auth/components/Button';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';
import Toast from '../../shared/components/Toast';

// Componente CartItem con animaciones
function CartItem({ item, removeFromCart }) {
  const [isRemoving, setIsRemoving] = useState(false);

  // Animación de hover
  const [isHovered, setIsHovered] = useState(false);
  const hoverSpring = useSpring({
    transform: isHovered ? 'translateX(-4px)' : 'translateX(0px)',
    boxShadow: isHovered 
      ? '0 4px 12px rgba(0, 0, 0, 0.1)' 
      : '0 1px 3px rgba(0, 0, 0, 0.05)',
    config: config.wobbly,
  });

  // Animación de salida
  const exitSpring = useSpring({
    opacity: isRemoving ? 0 : 1,
    transform: isRemoving ? 'translateX(100%) scale(0.8)' : 'translateX(0%) scale(1)',
    config: { tension: 200, friction: 20 },
    onRest: () => {
      if (isRemoving) {
        removeFromCart(item.id);
      }
    },
  });

  const handleRemove = () => {
    setIsRemoving(true);
  };

  return (
    <animated.div
      style={{ ...hoverSpring, ...exitSpring }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200"
    >
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
        <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
      </div>
      <div className="text-right">
        <p className="text-lg font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={handleRemove}
          className="text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Quitar
        </button>
      </div>
    </animated.div>
  );
}

// Componente animado para el total
function AnimatedTotal({ value }) {
  const { number } = useSpring({
    from: { number: 0 },
    number: value,
    config: config.slow,
  });

  return (
    <animated.span>
      {number.to(n => `$${n.toFixed(2)}`)}
    </animated.span>
  );
}

// Página principal del carrito
export default function CartPage() {
  const { cartItems, removeFromCart, clearCart, cartTotal } = useCart();
  const { isLoggedIn, user } = useAuth();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showAuthToast, setShowAuthToast] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({ mode: 'onChange' });

  const shippingCost = 0.00;
  const finalTotal = cartTotal + shippingCost;

  // Transiciones para los items del carrito
  const transitions = useTransition(cartItems, {
    keys: item => item.id,
    from: { opacity: 0, transform: 'translateY(-20px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateX(100%)' },
    config: config.gentle,
  });

  // Animación del panel de sumario
  const summarySpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: config.gentle,
  });

  const handleAuthCheck = (e) => {
    if (!isLoggedIn) {
      e.target.blur();
      setIsModalOpen(true);
      setShowAuthToast(true);
    }
  };

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
    navigate('/');
  };

  const handleLoginSuccess = () => {
    setIsModalOpen(false);
    handleSubmit(submitOrder)();
  };

  const handleRegisterSuccess = () => {
    setIsRegisterModalOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen p-4 md:p-8">
        <div className="max-w-2xl mx-auto">

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Tu Carrito de Compras</h1>
            <button
              onClick={() => navigate('/')}
              className="text-purple-600 hover:text-purple-800 font-medium transition-colors"
            >
              Regresar a la tienda
            </button>
          </div>

          {cartItems.length > 0 ? (
            <form onSubmit={handleSubmit(handleFinalizePurchase)}>
              {/* Lista de Items con animaciones */}
              <div className="space-y-4 mb-6">
                {transitions((style, item) => (
                  <animated.div key={item.id} style={style}>
                    <CartItem item={item} removeFromCart={removeFromCart} />
                  </animated.div>
                ))}
              </div>

              {/* Formulario de Direcciones */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6 space-y-4">
                <h2 className="text-xl font-semibold text-gray-800">Datos de Envío</h2>
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
                    className="w-full p-2 rounded-lg bg-gray-100 text-black border-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows="2"
                    onFocus={handleAuthCheck}
                  ></textarea>
                </div>
              </div>

              {/* Sumario con animaciones */}
              <animated.div 
                style={summarySpring}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
              >
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Sumario de Orden</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <AnimatedTotal value={cartTotal} />
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-900 font-bold text-lg mt-2 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <AnimatedTotal value={finalTotal} />
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
                    className="text-sm text-red-600 hover:text-red-800 transition-colors"
                  >
                    Vaciar Carrito
                  </button>
                  <AuthSubmitButton
                    isLoading={isLoading}
                    isValid={isValid && cartItems.length > 0}
                    text="Finalizar Compra"
                    className="cursor-pointer bg-purple-600 text-white rounded-lg p-2.5 transition-colors duration-200 hover:bg-purple-700 disabled:bg-gray-300"
                  />
                </div>
              </animated.div>
            </form>
          ) : (
            <p className="text-center text-gray-600">Tu carrito está vacío.</p>
          )}

        </div>
      </div>

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

      <Toast
        open={showSuccessToast}
        title="¡Compra Exitosa!"
        message="Tu orden ha sido creada."
        onClose={handleToastClose}
      />

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