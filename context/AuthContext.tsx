import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { decodeToken } from '../services/tokenService'

type AuthContextType = {
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  userInfo: any;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);



/*
useEffect(() => {
  const checkStorage = async () => {
    
    const allKeys = await AsyncStorage.getAllKeys();
    const allData = await AsyncStorage.multiGet(allKeys);
    console.log('Contenido de AsyncStorage context:', allData);

  };
  checkStorage();
}, []);*/

useEffect(() => {
  
  const checkToken = async () => {
    const allKeys = await AsyncStorage.getAllKeys();
    const allData = await AsyncStorage.multiGet(allKeys);
    //console.log('Contenido de AsyncStorage context:', allData);
    const token = await AsyncStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      const currentTime = Math.floor(Date.now() / 1000); // tiempo actual en segundos

      const tokenExp = Number(decoded?.exp); 

      if (tokenExp && tokenExp < currentTime) {
        // Token expirado
        console.log('entro al if')
         const allKeys = await AsyncStorage.getAllKeys();
        const allData = await AsyncStorage.multiGet(allKeys);
         //console.log('Contenido de AsyncStorage dentro:', allData);
    
        await AsyncStorage.removeItem('token');
         await AsyncStorage.removeItem('perfil');
        setIsLoggedIn(false);
        setUserInfo(null);
      } else {
        // Token válido
        setUserInfo(decoded);
        setIsLoggedIn(true);
      }
    }
    //console.log('despues del if',allData)
    setIsLoading(false);
  };

  checkToken();
}, []);

 const login = async (token: string) => {
  const tokenDecode = decodeToken(token);

  if (tokenDecode) {
    console.log('perfil descodificado', tokenDecode.perfil);

    await AsyncStorage.setItem('token', token);
    setUserInfo(tokenDecode);

    const perfil = tokenDecode.perfil;
    if (typeof perfil === 'string' && perfil.trim() !== '') {
      await AsyncStorage.setItem('perfil', perfil);
    } else {
      console.warn('Perfil no definido o vacío, no se guarda en AsyncStorage');
    }

    setIsLoggedIn(true);
  }
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
