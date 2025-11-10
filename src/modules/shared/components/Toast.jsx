import { useEffect } from 'react';

export default function Toast({ open, title = 'Listo', message, onClose, duration = 2500 }) {
  useEffect(() => {
    if (!open) return;

    const id = setTimeout(onClose, duration);

    return () => clearTimeout(id);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 pointer-events-none">
      <div className="pointer-events-auto flex justify-center w-full max-w-full px-4 pt-4">
        <div
          role="status"
          className="rounded-lg shadow-xl bg-white text-gray-900
                     border-t-4 border-purple-600 p-4 w-full max-w-sm
                     animate-slide-down"
        >
          <div className="text-sm font-semibold text-gray-900">{title}</div>
          {message && <div className="text-sm text-gray-600">{message}</div>}
          <button
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium
                       bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}