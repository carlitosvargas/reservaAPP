import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const API_URL = 'http://192.168.0.55:3000';

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
