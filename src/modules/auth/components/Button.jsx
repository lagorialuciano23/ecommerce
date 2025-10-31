import React from 'react';

/**
 * Un botón de envío reutilizable para formularios de autenticación.
 * Muestra un estado de carga y se deshabilita automáticamente.
 */
export default function Button({ isLoading, isValid, text = 'Enviar' }) {
  return (
    <button
      className='w-full cursor-pointer bg-gray-200 text-gray-900 rounded-lg p-3 transition-colors duration-200 hover:bg-gray-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed'
      type='submit'
      // 1. Se deshabilita si el formulario no es válido O si está cargando
      disabled={!isValid || isLoading}
    >
      {/* 2. Muestra un texto diferente cuando está cargando */}
      {isLoading ? 'Verificando...' : text}
    </button>
  );
}