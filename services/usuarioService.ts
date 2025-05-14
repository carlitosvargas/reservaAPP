import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../environment/config';


  export const obtenerUsuarioPorId = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/usuarios/obtenerUsuarioId/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };


  export const actualizarUsuario = async (id: number, usuarioData: any) => {
    try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.put(`${API_URL}/usuarios/actualizarUsuario/${id}`,usuarioData, {
      headers: {                                      
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
     } catch (error: any) {
       console.error('Error al actualizar el usuario', error.response?.data || error.message);
    throw error;
  }
  };