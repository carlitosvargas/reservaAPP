import React, { useEffect, useRef } from 'react';
import { Slot, usePathname } from 'expo-router';
import { View, Text, StyleSheet, useColorScheme, Animated } from 'react-native';
import { AuthProvider } from '../context/AuthContext';
import BackButton from '@/components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null
  const isDark = colorScheme === 'dark';
  const pathname = usePathname();

  const esPrincipal= pathname === '/login' || '/registro' || '/recuperarContrasenia' || '/resetear/[token]';
  const esResgistro = pathname === '/registro';
  const esRecuperar = pathname === '/recuperarContrasenia';
  const esPantallaSecundaria = pathname.startsWith('/pantallas/');

  // Diccionario de rutas → títulos personalizados
  const titulosPorRuta: Record<string, string> = {
    '/choferReserva': 'Reservas',
    '/choferViajes': 'Viajes',
    '/crearEmpresa': 'Crear una Empresa',
    '/empresaUsuarios': 'Empleados',
    '/listarReservas': 'Reservas',
    '/listarTransportes': 'Transportes',
    '/listarViajes': 'Viajes',
    '/perfil': 'Mi perfil',
    '/reserva': 'Mis Reservas',
    '/usuarios': 'Usuarios',
    '/viajes': 'Buscar Viajes',
    '/pantallas/actualizarContrasenia': 'Actualizar Contraseña',
    '/pantallas/choferListaPasajeros': 'Lista de Pasajeros',
    '/pantallas/confirmarReserva': 'Lista de Reservas',
    '/pantallas/crearTransporte': 'Crear Transporte',
    '/pantallas/crearViaje': 'Crear Nuevo Viaje',
    '/pantallas/detalleReserva': 'Detalle de reserva',
    '/pantallas/detalleVenta': 'Detalle de la Venta',
    '/pantallas/editarTransporte': 'Modificar Transporte',
    '/pantallas/editarViaje': 'Modificar Viaje',
    '/pantallas/listarReservasPorViaje': 'Reservas del Viaje',
    '/pantallas/modificarEmpresa': 'Modificar Empresa',
    '/pantallas/modificarPasajero': 'Modificar Pasajero',
    '/pantallas/modificarUsuario': 'Modificar Usuario',
    '/pantallas/realizarReserva': 'Nueva reserva',
  };

  const tituloHeader = titulosPorRuta[pathname] || 'V&V Reservas 🚌';

  // === Animación: fade in del título ===
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fadeAnim.setValue(0); // Reinicia la animación
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [tituloHeader]);

  return (
    <AuthProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar
          style={isDark ? 'light' : 'dark'}
          backgroundColor={isDark ? '#000' : '#fff'}
          translucent={false}
        />
        <View style={styles.container}>
          {!esPrincipal && (
            <View style={styles.header}>
              {esPantallaSecundaria && <BackButton />}
              <Animated.Text
                style={[
                  styles.title,
                  esPantallaSecundaria && { marginLeft: 10 },
                  { opacity: fadeAnim }, 
                ]}
              >
                {tituloHeader}
              </Animated.Text>
            </View>
          )}
          <View style={styles.content}>
            <Slot />
          </View>
        </View>
      </SafeAreaView>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111'
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    opacity: 0.95, 
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 0,
  },
});
