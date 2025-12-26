import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LocalStorage'dan kullanıcıyı yükle
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (kullanici_adi, sifre) => {
    try {
      const response = await authAPI.login(kullanici_adi, sifre);
      const userData = response.data.kullanici;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Giriş başarısız',
      };
    }
  };

  const logout = async () => {
    if (user) {
      await authAPI.logout(user.kullanici_id);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const changePassword = async (eski_sifre, yeni_sifre) => {
    try {
      await authAPI.changePassword(user.kullanici_id, eski_sifre, yeni_sifre);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Şifre değiştirilemedi',
      };
    }
  };

  const value = {
    user,
    login,
    logout,
    changePassword,
    loading,
    isAuthenticated: !!user,
    isOgrenci: user?.kullanici_tipi === 'ogrenci',
    isOgretmen: user?.kullanici_tipi === 'ogretmen',
    isAdmin: user?.kullanici_tipi === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
