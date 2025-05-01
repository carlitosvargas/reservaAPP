import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.55:3000';

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

  export const obtenerViajesId = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/viajes/obtenerViajesId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };


