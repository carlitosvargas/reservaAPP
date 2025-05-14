/*import { Slot, Stack } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useSegments } from 'expo-router';
import { View } from 'react-native';
import BackButton from '../components/BackButton';


export default function RootLayout() {



  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Slot />
      </SafeAreaView>
    </AuthProvider>
  );
}*/
// app/_layout.tsx
import { Slot } from 'expo-router';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { AuthProvider } from '../context/AuthContext';
import BackButton from '../components/BackButton'; // Si tienes un componente de BackButton

export default function RootLayout() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        <View style={styles.header}>
          {/* BackButton solo se muestra si se puede volver */}
          <BackButton />
          <Text style={styles.title}>Mi App 🚀</Text>
        </View>
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
    padding: 16,
  },
});