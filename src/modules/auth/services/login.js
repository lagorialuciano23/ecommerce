/**
 * Llama al endpoint de login del backend.
 * @param {string} username - El nombre de usuario (ej. 'dybalux')
 * @param {string} password - La contraseña (ej. 'StarPlatinum2!')
 * @returns {Promise<object>} - La respuesta del backend (ej. { user, token }).
 * @throws {Error} - Lanza un error con un mensaje amigable.
 */
export async function loginService(username, password) {

  // 1. Preparamos el body con las mayúsculas que espera el backend de C#
  const requestBody = {
    Username: username,
    Password: password,
  };

  try {
    const response = await fetch('/api/auth/login', {
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
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();

          errorText = errorData.message || 'Error en la respuesta JSON.';
        } else if (response.status === 401) {
          // El backend devuelve un string simple para 401
          errorText = 'Usuario o Contraseña Incorrectos.';
        } else {
          errorText = `Error ${response.status}: Falla interna del servidor.`;
        }
      } catch (e) {
        // Si response.json() falla o no hay 'content-type'
        errorText = `Error ${response.status}: No se pudo leer la respuesta del servidor.`;
      }

      throw new Error(errorText);
    }

    // 3. Éxito (200 OK)
    // Devolvemos la respuesta JSON completa
    return response.json();

  } catch (error) {
    // 4. Manejo de errores de red (ej. 'Failed to fetch')
    if (error.message.includes('Failed to fetch')) {
      throw new Error('No se pudo conectar con el servidor. Revisa la consola.');
    }

    // Relanzamos el error (ej. "Usuario o Contraseña Incorrectos.")
    throw error;
  }
}