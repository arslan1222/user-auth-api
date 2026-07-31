import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import authService from '../services/authService';

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
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          authService.setAuthToken(storedToken);
          const userData = await authService.getProfile();
          setUser(userData);
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error loading user:', error);
        localStorage.removeItem('authToken');
        authService.removeAuthToken();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(userData);
      const { token, user } = response;
      
      localStorage.setItem('authToken', token);
      authService.setAuthToken(token);
      setUser(user);
      setToken(token);
      
      toast.success('Registration successful! Welcome aboard.');
      navigate('/dashboard');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      const { token, user } = response;
      
      localStorage.setItem('authToken', token);
      authService.setAuthToken(token);
      setUser(user);
      setToken(token);
      
      toast.success('Welcome back!');
      navigate('/dashboard');
      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('authToken');
    authService.removeAuthToken();
    setUser(null);
    setToken(null);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setIsLoading(true);
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    try {
      setIsLoading(true);
      const response = await authService.changePassword(passwordData);
      // Update token if new one provided
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        authService.setAuthToken(response.token);
        setToken(response.token);
      }
      toast.success('Password changed successfully');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to change password';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};