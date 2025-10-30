/**
 * Mapeo de códigos de error de API a mensajes amigables para el usuario.
 * @type {Record<number, string>}
 */
export const frontendErrorMessage = {
  // Error de Autenticación HTTP 401 (Directo de la API)
  401: 'Usuario y/o Contraseña no son correctos',

  // Código genérico para errores de conexión (ej. socket hang up, fetch fallido)
  999: 'No se pudo conectar con el servidor. Verifica que tu API esté activa.',
};