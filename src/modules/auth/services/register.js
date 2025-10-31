/**
 * Llama al endpoint de registro del backend.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} - El mensaje de éxito del backend.
 * @throws {Error} - Lanza un error con un mensaje amigable.
 */
export async function registerService(username, email, password) {

  // 1. Preparamos el body con las mayúsculas que espera C#
  const requestBody = {
    Username: username,
    Email: email,
    Password: password,
  };

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    // 2. Manejo de errores (4xx, 5xx)
    if (!response.ok) {
      let errorText = `Error ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();

        // El backend (Identity) devuelve un ARRAY de errores
        if (Array.isArray(errorData)) {
          // Tomamos solo la primera descripción de error para mostrar
          errorText = errorData[0]?.description || 'Error al registrar el usuario.';
        } else {
          // Error genérico del middleware
          errorText = errorData.message || 'Error en la respuesta del servidor.';
        }
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // Si response.json() falla
        errorText = `Error ${response.status}: Falla interna del servidor.`;
      }

      throw new Error(errorText);
    }

    // 3. Éxito (200 OK)
    // El backend devuelve un string simple: "Usuario Registrado con Exito"
    return response.text();

  } catch (error) {
    // 4. Manejo de errores de red
    if (error.message.includes('Failed to fetch')) {
      throw new Error('No se pudo conectar con el servidor. Revisa la consola.');
    }

    // Relanzamos el error (ej. "Username 'dybalux' is already taken.")
    throw error;
  }
}