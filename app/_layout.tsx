import { Slot } from 'expo-router';
import { AuthProvider } from './context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Slot />
      </SafeAreaView>
    </AuthProvider>
  );
}
