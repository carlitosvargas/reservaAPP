import { useRouter, usePathname } from 'expo-router';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Mapeo de rutas actuales a rutas de destino personalizadas
  const rutasPersonalizadas: Record<string, string> = {
    '/pantallas/detalleReserva': '/reserva',
    '/pantallas/modificarUsuario': '/perfil',
    '/pantallas/realizarReserva': '/viajes',
    '/pantallas/ventaReserva' : '/reserva',
    '/pantallas/detalleVenta': '/reserva',
    
    
    // más rutas si necesitás
  };

  const handleBack = () => {
    if (rutasPersonalizadas[pathname]) {
     router.replace(rutasPersonalizadas[pathname] as any);
 // redirige sin dejar la ruta anterior en el stack
    } else {
      router.back(); // comportamiento por defecto
    }
  };

  return (
    <Pressable onPress={handleBack}>
      <Ionicons name="arrow-back" size={24} color="white" />
    </Pressable>
  );
}