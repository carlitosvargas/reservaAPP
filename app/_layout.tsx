import { Slot, usePathname } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { AuthProvider } from '../context/AuthContext';


export default function RootLayout() {
  const pathname = usePathname();

  const esLogin = pathname === '/login';
 

  return (
    <AuthProvider>
      <View style={styles.container}>
        {/* Oculta encabezado si es login */}
        {!esLogin && (
          <View style={styles.header}>
            <Text style={styles.title}>V&V Reservas 🚌</Text>
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
    flexDirection: 'row', // Alineación horizontal
    alignItems: 'center', // Alineación vertical centrada
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1, // Permite que el título ocupe el espacio disponible
    textAlign: 'center', // Centra el texto en el espacio disponible
  },
  content: {
    flex: 1,
    padding:0,
  },
});