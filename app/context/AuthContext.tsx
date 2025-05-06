import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeToken } from '../services/tokenService'

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string, perfil: string) => Promise<void>;
  logout: () => Promise<void>;
  userInfo: any;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);






  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const decoded = decodeToken(token);
        setUserInfo(decoded);
        setIsLoggedIn(true);
      }
      setIsLoading(false);
    };
    checkToken();
  }, []);

  const login = async (token: string) => {
    const tokenDecode = decodeToken(token) 
    if (tokenDecode) {
      console.log('perfil descodificado',tokenDecode.perfil )
    await AsyncStorage.setItem('token', token);
    setUserInfo(tokenDecode);
    await AsyncStorage.setItem('perfil', tokenDecode.perfil);
    setIsLoggedIn(true);}

  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('perfil');
    setUserInfo(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, isLoading,userInfo   }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
