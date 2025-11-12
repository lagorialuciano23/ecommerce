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
  //Obtenemos el token del almacenamiento local
    const token = localStorage.getItem('token');

    //si el token existen lo agregamos a los headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // --- Manejo de Errores Centralizado ---
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.response) {
      // El backend respondió con un error (4xx, 5xx)
      // Usamos el 'message' que envia el Middleware de C#
      errorMessage = error.response.data?.message || error.response.data || error.message;

      if (error.response.status === 401) {
        // Si el token es inválido, podríamos desloguear al usuario
        console.error('Error 401: No autorizado. Redirigiendo al login...');
      }
    } else if (error.request) {
      // La petición se hizo pero no hubo respuesta (API caída)
      errorMessage = 'No se pudo conectar con el servidor. Revisa que la API esté funcionando.';
    }

    // Rechazamos la promesa con el mensaje de error limpio
    return Promise.reject(new Error(errorMessage));
  },
);
