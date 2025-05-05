import { jwtDecode } from "jwt-decode";
interface TokenPayload {
  id: number;
  contrasenia: string;
  perfil: string;
  iat: number;
  exp: string;
}
export const decodeToken = (token: any) => {
  try {
    return jwtDecode<TokenPayload>(token); // Devuelve el payload del token
  } catch (error) {
    console.error('Token inválido o mal formado:', error);
    return null;
  }
};
