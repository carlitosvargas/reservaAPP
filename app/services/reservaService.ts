import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../environment/config';

export const crearReserva = async (reservaData: any) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_URL}/reserva/crearReserva`,reservaData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Agregar token al encabezado
          },
        }
      );
      
      return response.data;
  } catch (error: any) {
    console.error('Error al crear la reserva', error.response?.data || error.message);
    throw error;
  }
};

  export const actualizarReserva = async (id: number, reservaData: any) => {
    try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.put(`${API_URL}/reserva/actualizarReserva/${id}`,reservaData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
     } catch (error: any) {
       console.error('Error al actualizar la reserva', error.response?.data || error.message);
    throw error;
  }
  };

  export const obtenerPasajeroPorId = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/reserva/listarPasajeroPorId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };