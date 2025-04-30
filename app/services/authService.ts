import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.11:3000';

export const loginUsuario = async (usuario: string, contrasenia: string) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    usuario,
    contrasenia,
  });
  return response.data; // contiene { token, perfil }
};

export const listarViajes = async (origen: string, destino: string) => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/viajes/viajesDisponible`, {
      params: {
        origen,
        destino,

      },
      headers: {
        Authorization: `Bearer ${token}`,  
      },
    });
    return response.data;
  };
