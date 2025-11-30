import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';


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

  // REGISTRO: ahora llama al BACKEND
  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = await api.registrarUsuario(userData);
      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

 
  // Login usando BACKEND
const login = async (email, password) => {
  setLoading(true);
  try {
    // el backend espera campos: correo, contrasenia
    const loggedUser = await api.login(email, password);
    setUser(loggedUser);
    localStorage.setItem('currentUser', JSON.stringify(loggedUser));
    return loggedUser;
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
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
