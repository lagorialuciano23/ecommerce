export const login = async (username, password) => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        Username: username,
        Password: password 
      }),
    });

    if (!response.ok) {
      let errorData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        errorData = await response.json();
      } else {
        // Si no es JSON, lee como texto
        const errorText = await response.text();
        errorData = {
          code: 'UNKNOWN_ERROR',
          message: errorText || 'Error del servidor'
        };
      }

      return {
        data: null,
        error: {
          ...errorData,
          frontendErrorMessage: frontendErrorMessage[errorData.code] || errorData.message,
        },
      };
    }
    const responseToken = await response.json();
    console.log('responseToken:', responseToken);
    // verifica si token es un objeto o string
    const token = typeof responseToken.token === 'string' 
      ? responseToken.token 
      : JSON.stringify(responseToken.token); //parsea el token
    
    console.log('token final:', token);
    console.log('tipo final:', typeof token);
    
    return { data: token, error: null };
    
  } catch (error) {
    console.error('Login error:', error);
    return {
      data: null,
      error: {
        code: 'NETWORK_ERROR',
        frontendErrorMessage: 'Error de conexión. Verifica tu internet.',
      },
    };
  }
};