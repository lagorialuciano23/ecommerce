/**
 * Llama al endpoint de registro de Clientes (User).
 * @param {string} username
 * @param {string} email
 * @param {string} password
 * @returns {Promise<string>} - El mensaje de éxito del backend.
 * @throws {Error} - Lanza un error con un mensaje amigable.
 */
export async function registerCustomerService(username, email, password) {

  // Preparamos el body (sin 'Role')
  const requestBody = {
    Username: username,
    Email: email,
    Password: password,
    // No enviamos 'Role', el backend lo asigna
  };

  try {
    // 1. Llamamos al NUEVO endpoint
    const response = await fetch('/api/auth/register-customer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorText;

      try {
        const errorData = await response.json();

        errorText = errorData.message;
      // eslint-disable-next-line no-unused-vars
      } catch (e) {
        errorText = `Error ${response.status}: Falla interna del servidor.`;
      }
      throw new Error(errorText);
    }

    return response.text();

  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      throw new Error('No se pudo conectar con el servidor. Revisa la consola.');
    }

    throw error;
  }
}