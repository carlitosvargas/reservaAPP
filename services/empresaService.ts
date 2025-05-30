import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../environment/config';

export const obtenerEmpresaPorId = async (id: number) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.get(`${API_URL}/empresa/obtenerEmpresaId/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const actualizarEmpresa = async (id: number, empresaData: any) => {
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.put(`${API_URL}/empresa/actualizarEmpresa/${id}`, empresaData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error al actualizar la empresa', error.response?.data || error.message);
    throw error;
  }
};
