import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { API_URL } from '../environment/config';

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

  export const obtenerPasajerosPorViaje = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/viajes/obtenerPasajerosViajesId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };


    export const obtenerLocalidades = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/ubicacion/obtenerLocalidad/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

   export const obtenerProvincias= async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/ubicacion/obtenerProvincia/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };


  export const obtenerVentaDetalle = async (id: number) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.get(`${API_URL}/viajes/obtenerVentasViajesId/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


  export const obtenerViajesPorChofer = async (id: number) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.get(`${API_URL}/viajes/obtenerViajesPorChofer/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};




