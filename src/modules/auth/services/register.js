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

      try {
        // El backend de Identity envía un ARRAY de errores
        const errorData = await response.json();

        if (Array.isArray(errorData) && errorData.length > 0) {

          // ▼▼▼ ¡INICIO DE LA MODIFICACIÓN! ▼▼▼

          // 1. Mapeamos y traducimos CADA error
          const errorMessages = errorData.map(error => {
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

            if (desc.includes('Passwords must have at least one uppercase')) {
              return 'La contraseña debe tener al menos una mayúscula.';
            }

            if (desc.includes('Passwords must have at least one lowercase')) {
              return 'La contraseña debe tener al menos una minúscula.';
            }

            if (desc.includes('Passwords must have at least one digit')) {
              return 'La contraseña debe tener al menos un número.';
            }

            if (desc.includes('Passwords must have at least one non alphanumeric')) {
              return 'La contraseña debe tener al menos un carácter especial.';
            }

            return desc; // Devolver el error original si no lo conocemos
          });

          // 2. Unimos todos los mensajes de error en un solo string
          errorText = errorMessages.join(' ');

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