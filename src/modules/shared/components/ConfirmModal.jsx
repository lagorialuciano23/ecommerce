import React from 'react';

export default function ConfirmModal({
  open,
  title,
  message,
  onClose,
  onConfirm,
  isConfirming = false,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
}) {
  if (!open) return null;

  return (
    // Fondo oscuro (overlay)
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      {/* Contenido (con estilos light-mode para el admin) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm" // <-- Fondo blanco
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3> {/* <-- Texto oscuro */}
        <p className="text-gray-600 mb-6">{message}</p> {/* <-- Texto oscuro */}

        {/* Contenedor de botones */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isConfirming}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition disabled:opacity-50" // Botón Cancelar (claro)
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isConfirming}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition disabled:bg-gray-400" // Botón Confirmar (rojo)
          >
            {isConfirming ? `${confirmText}...` : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}