import axios from 'axios';

//Creamos la instancia de Axios
//La baseURL '/api' es la que le dice a Axios que use el proxy de Vite
export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
//Interceptor de Peticion (Request)
//Este codigo se ejecuta antes de que se haga la peticion
api.interceptors.request.use(
  (config) => {
  //Obtenemos el token de localStorage
    const token = localStorage.getItem('token');

    // Validar que el token sea válido antes de enviarlo
    if (token && token !== 'null' && token !== 'undefined') {
      console.log('Enviando token:', token.substring(0, 20) + '...'); // Log parcial
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No hay token válido para enviar');
    }

    return config;
  },
  (error) => {
    //Si hay un error al configurar la peticion , lo rechazamos
    return Promise.reject(error);
  });

//Interceptor de Respuesta (Response)
//Este codigo se ejecuta despues de recibir cada respuesta
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Creamos un objeto de error por defecto
    let errorResponse = {
      message: 'Ocurrió un error desconocido',
      code: 'UNKNOWN',
    };

    if (error.response) {
      const data = error.response.data;

      // CASO 1: Error de validación automática de .NET (El que te está pasando)
      // El formato es: { status: 400, errors: { "Campo": ["Error"] } }
      if (data && data.errors) {
        // Extraemos todos los mensajes de los arrays dentro de 'errors'
        const allErrors = Object.values(data.errors).flat();

        // Los unimos en un solo texto
        errorResponse.message = allErrors.join('. ');
        errorResponse.code = 'VALIDATION_ERROR';
      }
      // CASO 2: Error controlado por tu Middleware (BadRequestException)
      // El formato es: { message: "Texto", code: "CODIGO" }
      else if (typeof data === 'object' && data !== null && data.message) {
        errorResponse.message = data.message;
        errorResponse.code = data.code || 'BACKEND_ERROR';
      }
      // CASO 3: Backend mandó un string plano o algo desconocido
      else {
        errorResponse.message = error.message; // "Request failed with status code 400"
      }
    } else if (error.request) {
      errorResponse.message = 'No se pudo conectar con el servidor. Revisa que la API esté funcionando.';
      errorResponse.code = 'CONNECTION_ERROR';
    }

    // Rechazamos la promesa con el OBJETO de error formateado
    return Promise.reject(errorResponse);
  },
);
