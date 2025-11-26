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
    // Axios pone la respuesta del backend dentro de 'response.data'
    // Devolvemos 'response.data' para no tener que escribir 'response.data'
    // en cada llamada (ej. en los hooks o páginas)
    return response.data;
  },
  (error) => {
    // Creamos un objeto de error por defecto
    let errorResponse = {
      message: 'Ocurrió un error desconocido',
      code: 'UNKNOWN',
    };

    if (error.response) {
      // El backend respondió. 'error.response.data' es { message, code }
      if (typeof error.response.data === 'object' && error.response.data !== null) {
        errorResponse.message = error.response.data.message || error.message;
        errorResponse.code = error.response.data.code || 'BACKEND_ERROR';
      } else {
        // Si el backend mandó solo texto (ej. un 500 HTML)
        errorResponse.message = error.response.data || error.message;
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta (API caída)
      errorResponse.message = 'No se pudo conectar con el servidor. Revisa que la API esté funcionando.';
      errorResponse.code = 'CONNECTION_ERROR';
    }

    // Rechazamos la promesa con el OBJETO de error
    return Promise.reject(errorResponse);
  },
);
