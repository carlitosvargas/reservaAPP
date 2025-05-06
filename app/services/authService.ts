import axios from 'axios';
import { API_URL } from '../environment/config';

export const loginUsuario = async (usuario: string, contrasenia: string) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    usuario,
    contrasenia,
  });
  return response.data;
};

