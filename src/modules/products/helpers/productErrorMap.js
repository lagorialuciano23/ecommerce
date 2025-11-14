//Mapeo de errores
export const productErrorMap = {
  // Codigos del Back
  'SKU_INVALID_FORMAT': 'El SKU debe tener el formato "SKU-XXXXX" entre 5 y 10 caracteres.',
  'INTERNALCODE_INVALID_FORMAT': 'El Código Interno debe tener el formato "INT-XXXXX" entre 5 y 10 caracteres.',
  'MISSING_DATA': 'Faltan completar campos obligatorios.',
  'INVALID_NUMBERS': 'El precio debe ser mayor a 0 y el stock no puede ser negativo.',

  // Codigo de Axios
  'CONNECTION_ERROR': 'No se pudo conectar con el servidor. Intenta de nuevo.',
};