/**
 * Llama al endpoint de registro del backend.
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @param {string} role  // Añadimos rol
 * @returns {Promise<string>} - El mensaje de éxito del backend.
 * @throws {Error} - Lanza un error con un mensaje amigable.
 */
export async function registerService(username, email, password, role) {

  // 1. Preparamos el body con las mayúsculas que espera C#
  const requestBody = {
    Username: username,
    Email: email,
    Password: password,
    Role: role,
  };

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorText;

      try {
        // 1. Ahora SIEMPRE esperamos un JSON simple: { message: "..." }
        const errorData = await response.json();

        errorText = errorData.message;
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        // 2. Si falla el JSON (por un 500 o un 400 genérico), mostramos esto
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