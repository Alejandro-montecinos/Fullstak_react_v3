const API_BASE_URL = '';

export const api = {
  registrarUsuario: async (usuario) => {
    const response = await fetch(`${API_BASE_URL}/api/pokemon/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) {
      let errorMsg = 'Error al registrar';
      try {
        const errorBody = await response.json();
        if (errorBody.message) errorMsg = errorBody.message;
      } catch (e) {}
      throw new Error(errorMsg);
    }

    return response.json();
  },

  login: async (correo, contrasenia) => {
    const response = await fetch(`${API_BASE_URL}/api/pokemon/usuarios/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasenia }),
    });

    if (!response.ok) {
      throw new Error('Credenciales incorrectas');
    }

    return response.json(); // aquí vuelve el UsuarioModel
  },

  // ... registrarUsuario, login

  obtenerProductos: async () => {
    const response = await fetch(`${API_BASE_URL}/api/pokemon/productos`);
    if (!response.ok) {
      throw new Error('Error al obtener productos');
    }
    return response.json(); // [{ id, nombre, rutaImagen, precio, cantidad }, ...]
  },


};


