import axios from 'axios';

const API_URL = 'http://192.168.1.108:3000';

export const loginUsuario = async (usuario: string, contrasenia: string) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, {
    usuario,
    contrasenia,
  });
  return response.data;
};

