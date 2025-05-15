import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../environment/config';



   export const crearVenta = async ( ventaData: any) => {
    try {
        console.log('ver ventas Data', ventaData)
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(`${API_URL}/ventas/crearVenta/`,ventaData, {
      headers: {                                      
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
     } catch (error: any) {
       console.error('Error al crear la venta', error.response?.data || error.message);
    throw error;
  }

  
};

 export const obtenerVentaDetalle = async (id: number) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.get(`${API_URL}/ventas/obtenerVentaDetalleGeneral/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
