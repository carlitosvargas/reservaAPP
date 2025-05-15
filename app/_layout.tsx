import { Slot, usePathname, useNavigation, router } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  const pathname = usePathname();
  const navigation = useNavigation();

  const esLogin = pathname === '/login';
  const esPantallaSecundaria = pathname.startsWith('/pantallas/');

  // Diccionario de rutas → títulos personalizados
  const titulosPorRuta: Record<string, string> = {
    '/perfil': 'Mi perfil',
    '/reserva': 'Mis Reservas',
    '/viajes': 'Buscar Viajes',
    '/pantallas/detalleReserva': 'Detalle de reserva',
    '/pantallas/modificarPasajero': 'Modificar Pasajero',
    '/pantallas/realizarReserva': 'Nueva reserva',
  };

  const tituloHeader = titulosPorRuta[pathname] || 'V&V Reservas 🚌';

  return (
    <AuthProvider>
      <View style={styles.container}>
        {!esLogin && (
          <View style={styles.header}>
            {esPantallaSecundaria && (
              <Pressable onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#fff" />
              </Pressable>
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
    padding: 0,
  },
});
