import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, perfil: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);



  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');

      setIsLoggedIn(token !== null && token.trim() !== '');
      setIsLoading(false);
    };
    checkToken();
  }, []);

  const login = async (token: string, perfil: string) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('perfil', perfil);
    setIsLoggedIn(true);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('perfil');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isLoading  }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
