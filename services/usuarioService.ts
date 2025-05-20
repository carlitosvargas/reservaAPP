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

<<<<<<< HEAD
  export const actualizarContraseña = async (id: number, data: any) => {
=======
  export const obtenerUsuarios = async () => {
    try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get(`${API_URL}/usuarios/obtenerUsuario`, {
      headers: {                                      
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
     } catch (error: any) {
       console.error('Error al obtener usuarios', error.response?.data || error.message);
    throw error;
  }
  };

 export const actualizarPerfil = async (id: number, perfil_id: number) => {
  const token = await AsyncStorage.getItem('token');
  const response = await axios.put( `${API_URL}/usuarios/actualizarPerfil/${id}`, {perfil_id},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const actualizarContraseña = async (id: number, data: any) => {
>>>>>>> 829015d84e489e7e28420ecfec8933a8d58641a2
  try {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.put(`${API_URL}/usuarios/actualizarContrasenia/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error al actualizar la contraseña', error.response?.data || error.message);
<<<<<<< HEAD
    throw error;
=======
    throw error.response?.data || {mensaje:'Error desconocido al actualizar la contraseña'};
>>>>>>> 829015d84e489e7e28420ecfec8933a8d58641a2
  }
};