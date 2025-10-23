// src/components/Toast.jsx
import { useEffect } from 'react';

export default function Toast({ open, title = 'Listo', message, onClose, duration = 2500 }) {
  useEffect(() => {
    if (!open) return;

    const id = setTimeout(onClose, duration);

    return () => clearTimeout(id);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    // Contenedor fijo en la parte superior (top-0) y centrada.
    <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      {/* Contenedor centrador que limita el ancho del toast */}
      <div className="pointer-events-auto flex justify-center w-full max-w-full px-4 pt-4">
        <div
          role="status"
          // Clases para el estilo Top Accent Border
          className="rounded-b-lg rounded-t-sm shadow-xl bg-neutral-900/95 text-neutral-100
                     border-t-4 border-[#263e77] p-5 w-full max-w-sm"
        >
          <div className="text-sm font-semibold">{title}</div>
          {message && <div className="text-sm/6 opacity-90">{message}</div>}
          <button
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium
                       border border-neutral-700 hover:bg-neutral-800 transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
