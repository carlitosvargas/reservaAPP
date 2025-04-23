import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  perfil: string | null;
  login: (token: string, perfil: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  perfil: null,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [perfil, setPerfil] = useState<string | null>(null);

  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      const perfilStored = await AsyncStorage.getItem('perfil');
      if (token) {
        setIsAuthenticated(true);
        setPerfil(perfilStored);
      }
    };
    checkToken();
  }, []);

  const login = async (token: string, perfil: string) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('perfil', perfil);
    setIsAuthenticated(true);
    setPerfil(perfil);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('perfil');
    setIsAuthenticated(false);
    setPerfil(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, perfil, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
