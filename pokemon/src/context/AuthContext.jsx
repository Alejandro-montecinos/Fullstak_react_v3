import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  // Cargar usuarios existentes al inicializar
  useEffect(() => {
    const storedUsers = localStorage.getItem('pokemonUsers');
    const currentUser = localStorage.getItem('currentUser');
    
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    }
    
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
  }, []);

  const register = async (userData) => {
    setLoading(true);
    try {
      // Simulamos delay de registro
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Verificar si el usuario ya existe
      const existingUser = users.find(user => user.email === userData.email);
      if (existingUser) {
        throw new Error('El usuario ya está registrado');
      }

      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      };

      // Guardar en el estado local
      const updatedUsers = [...users, newUser];
      setUsers(updatedUsers);
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('pokemonUsers', JSON.stringify(updatedUsers));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      
      setUser(newUser);
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const storedUsers = JSON.parse(localStorage.getItem('pokemonUsers') || '[]');
      const foundUser = storedUsers.find(user => 
        user.email === email && user.password === password
      );

      if (!foundUser) {
        throw new Error('Credenciales incorrectas');
      }

      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return foundUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const value = {
    user,
    users,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};