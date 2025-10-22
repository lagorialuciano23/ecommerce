// src/components/Toast.jsx
import { useEffect } from "react";

export default function Toast({ open, title = "Listo", message, onClose, duration = 2500 }) {
  useEffect(() => {
    if (!open) return;
    const id = setTimeout(onClose, duration);
    return () => clearTimeout(id);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* contenedor superior-centro */}
      <div className="pointer-events-auto flex justify-center mt-6">
        <div
          role="status"
          className="mx-4 rounded-2xl shadow-xl bg-neutral-900/90 backdrop-blur-sm text-neutral-100 
                     border border-neutral-800 px-5 py-4 w-full max-w-sm"
        >
          <div className="text-sm font-semibold">{title}</div>
          {message && <div className="text-sm/6 opacity-90">{message}</div>}
          <button
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm 
                       border border-neutral-700 hover:bg-neutral-800 transition"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}
