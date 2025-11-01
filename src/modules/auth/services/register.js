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
      let errorText = `Error ${response.status}: ${response.statusText}`;
      let errorMessages = []; // <-- Array para guardar los errores

      try {
        const errorData = await response.json();

        // El backend ahora envía un array de errores YA TRADUCIDOS
        if (Array.isArray(errorData) && errorData.length > 0) {

          // 1. Mapeamos y traducimos CADA error
          errorMessages = errorData.map(error => { // <-- Asignamos al array
            const desc = error.Description; // 'Description' (con D mayúscula)

            // Traducción de errores comunes de Identity
            if (desc.includes('is already taken')) {
              return desc.includes('Username')
                ? 'Ese nombre de usuario ya está en uso.'
                : 'Ese email ya está en uso.';
            }

            if (desc.includes('Passwords must be at least')) {
              return 'La contraseña debe tener al menos 8 caracteres.';
            }

            // ... (todas las demás traducciones)
            if (desc.includes('Passwords must have at least one non alphanumeric')) {
              return 'La contraseña debe tener al menos un carácter especial.';
            }

            return desc;
          });
          // 2. Lanzamos un error personalizado que CONTIENE el array
          const apiError = new Error('Errores de validación del backend.');

          apiError.isApiError = true;
          apiError.messages = errorMessages; // Adjuntamos el array
          throw apiError;

        } else if (errorData.message) {
          errorText = errorData.message;
        } else {
          errorText = 'Error desconocido al registrar el usuario.';
        }

      } catch (e) {
        console.error('No se pudo parsear la respuesta de error como JSON:', e);
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