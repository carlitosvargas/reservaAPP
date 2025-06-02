import { Slot, usePathname, useNavigation, router } from 'expo-router';
import { View, Text, StyleSheet, Pressable, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from '../context/AuthContext';
import BackButton from '@/components/BackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const colorScheme = useColorScheme(); // 'light' | 'dark' | null

  const isDark = colorScheme === 'dark';
  const pathname = usePathname();
  const navigation = useNavigation();

  const esLogin = pathname === '/login';
  const esPantallaSecundaria = pathname.startsWith('/pantallas/');

  // Diccionario de rutas → títulos personalizados
  const titulosPorRuta: Record<string, string> = {
    '/choferViajes': 'viajes',
    '/listarReservas': 'Reservas',
    '/listarTransportes': 'Transportes',
    '/listarViajes': 'Viajes',
    '/perfil': 'Mi perfil',
    '/reserva': 'Mis Reservas',
    '/usuarios': 'Usuarios',
    '/viajes': 'Buscar Viajes',
    '/pantallas/actualizarContrasenia': 'Actualizar Contraseña',
    '/pantallas/choferListaPasajeros': 'Lista de Pasajeros',
    '/pantallas/crearTransporte': 'Crear Transporte',
    '/pantallas/detalleReserva': 'Detalle de reserva',
    '/pantallas/detalleVenta': 'Detalle de la Venta',
    '/pantallas/listarReservasPorViaje': 'Reservas del Viaje',
    '/pantallas/modificarEmpresa': 'Modificar Empresa',
    '/pantallas/modificarPasajero': 'Modificar Pasajero',
    '/pantallas/modificarUsuario': 'Modificar Usuario',
    '/pantallas/realizarReserva': 'Nueva reserva',
    
  };

  const tituloHeader = titulosPorRuta[pathname] || 'V&V Reservas 🚌';

  return (
    <AuthProvider>
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar
           style={isDark ? 'light' : 'dark'} // texto en blanco para fondo oscuro, negro para fondo claro
        backgroundColor={isDark ? '#000' : '#fff'} // fondo acorde al tema
        translucent={false}
      />
      <View style={styles.container}>
        {!esLogin && (
          <View style={styles.header}>
            {esPantallaSecundaria && (
              <BackButton />
            )}
            <Text style={[styles.title, esPantallaSecundaria && { marginLeft: 10 }]}>
              {tituloHeader}
            </Text>
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
   
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
    padding: 0,
  },
});