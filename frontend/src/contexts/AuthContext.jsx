import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          try {
            // Try to verify token with backend
            const userData = await authService.verifyToken();
            setUser(userData);
            setIsAuthenticated(true);
          } catch (error) {
            // If API fails, use stored user data for demo
            console.log('API verification failed, using stored user data');
            const userData = JSON.parse(storedUser);
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);

      // Mock authentication for demo purposes
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        const mockUser = {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@company.com',
          username: 'admin',
          role: 'Administrator',
          avatar: null,
          lastLogin: new Date().toISOString(),
          status: 'active'
        };

        localStorage.setItem('token', 'mock-jwt-token-admin');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
        return { success: true };
      } else if (credentials.username === 'user' && credentials.password === 'user123') {
        const mockUser = {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@company.com',
          username: 'user',
          role: 'User',
          avatar: null,
          lastLogin: new Date().toISOString(),
          status: 'active'
        };

        localStorage.setItem('token', 'mock-jwt-token-user');
        localStorage.setItem('user', JSON.stringify(mockUser));
        setUser(mockUser);
        setIsAuthenticated(true);
        return { success: true };
      }

      // Try actual API call as fallback
      try {
        const response = await authService.login(credentials);

        if (response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          setUser(response.user);
          setIsAuthenticated(true);
          return { success: true };
        }
      } catch (apiError) {
        console.log('API login failed, using mock authentication');
      }

      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Login failed'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response.token) {
        localStorage.setItem('token', response.token);
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      }
      
      return { success: false, error: 'Registration failed' };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
