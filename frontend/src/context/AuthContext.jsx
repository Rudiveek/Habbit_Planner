import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('aura_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('aura_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyUser = async () => {
      const storedToken = localStorage.getItem('aura_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('aura_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification fallback:', err.message);
          if (err.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: receivedToken, user: receivedUser } = res.data;
      
      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('aura_token', receivedToken);
      localStorage.setItem('aura_user', JSON.stringify(receivedUser));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || (err.message?.includes('Network Error') ? 'Connecting to cloud server... Please retry in a few seconds.' : err.message) || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token: receivedToken, user: receivedUser } = res.data;

      setToken(receivedToken);
      setUser(receivedUser);
      localStorage.setItem('aura_token', receivedToken);
      localStorage.setItem('aura_user', JSON.stringify(receivedUser));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || (err.message?.includes('Network Error') ? 'Connecting to cloud server... Please retry in a few seconds.' : err.message) || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('aura_token');
    localStorage.removeItem('aura_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      login: async () => ({ success: false }),
      register: async () => ({ success: false }),
      logout: () => {},
    };
  }
  return context;
};

export default AuthContext;
