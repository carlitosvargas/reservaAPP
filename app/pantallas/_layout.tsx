import { Slot } from 'expo-router';
import { AuthProvider } from '../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

export default function PantallaLayout() {
  return (
    <AuthProvider>
     
        <Slot />
    </AuthProvider>
  );
}
