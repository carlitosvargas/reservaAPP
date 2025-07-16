import React, { useEffect, useRef } from 'react';
import { Slot, usePathname, useRouter } from 'expo-router';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  Animated,
  TouchableOpacity,
  Platform,
  Pressable,
} from 'react-native';
import { AuthProvider, useAuth } from '../context/AuthContext';
import BackButton from '@/components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons} from '@expo/vector-icons';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const pathname = usePathname();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

 // const { userInfo } = useAuth();

  const esPrincipal =
    pathname === '/login' ||
    pathname === '/registro' ||
    pathname === '/recuperarContrasenia' ||
    pathname === '/resetear/[token]';

  const esPantallaSecundaria = pathname.startsWith('/pantallas/');

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

  const tituloHeader = titulosPorRuta[pathname] || 'V&V Reservas';

  useEffect(() => {
    fadeAnim.setValue(0);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [tituloHeader]);

  return (
    <AuthProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={isDark ? '#000' : '#fff'} />

        <View style={styles.container}>
          {!esPrincipal && (
            <>
              <View style={styles.header}>
                <View style={styles.side}>
                  {/* BackButton está flotando, así que puede estar vacío acá */}
                </View>

                <View style={styles.center}>
                  <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
                    {tituloHeader}
                  </Animated.Text>
                </View>
                 
               
                <View style={styles.side}>
                  <Pressable
                    onPress={() => router.push('/perfil')}
                    style={{ padding: 5 }}
                  >
                    <Ionicons name="person-circle-outline" size={30} color="#fff" />
                  </Pressable>
                </View>
               
              </View>

              {esPantallaSecundaria && (
                <View style={styles.backFloating}>
                  <BackButton />
                </View>
              )}
            </>
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
    backgroundColor: '#4c68d7',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    opacity: 0.95,
},

  side: {
    width: 40, 
    alignItems: 'center',
    justifyContent: 'center',
},

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
},

  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    fontStyle: 'italic',
    fontFamily: 'System', 
},

  content: {
    flex: 1,
    padding: 0,
  },
 backContainer: {
  paddingHorizontal: 10,
  paddingTop: 12,
  width: 'auto',
  alignSelf: 'flex-start',
  backgroundColor: 'transparent', 
},
backFloating: {
  position: 'absolute',
  top: 11, 
  left: 10,
  zIndex: 999,
  backgroundColor: 'transparent',
  borderRadius: 24,
  padding: 10,
  elevation: 5, 
  shadowColor: '#000', 
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.0,
  shadowRadius: 0.0,
},
perfilButton: {
  backgroundColor: 'transparente',
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 20,
  maxWidth: 120,
  alignItems: 'center',
  justifyContent: 'center',
  
},

perfilText: {
  color: '#ffffff',
  fontSize: 14,
  fontWeight: '600',
  textShadowColor: '#000',
  
},
icon:{
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 1.25,
  shadowRadius: 2.5,
  borderRadius: 24,
}

});