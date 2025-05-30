import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../environment/config';


  export const obtenerTransportePorEmpresa = async (id: number) => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/medioTransporte/obtenerTransportePorEmpresa/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  };

  
 export const eliminarTransporte = async (id: number) => {
  const token = await AsyncStorage.getItem('token');
  const data = {};
  const response = await axios.put(`${API_URL}/medioTransporte/eliminarTransporte/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

  export const crearTransporte = async (transporteData: any) => {
    const token = await AsyncStorage.getItem('token');
   const response = await axios.post(`${API_URL}/medioTransporte/crearTransporte`, transporteData ,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
   
  return response.data;
};