import { useRouter } from 'expo-router';
import { Button, View, Text, StyleSheet  } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function PerfilesScreen() {
  const router = useRouter();
  const { isLoggedIn, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/login'); 
  };
  return (
    <View>
        <Text>PANTALLA PERFIL</Text>
   <Button title="Cerrar sesión" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    textAlign: 'center',
  },
});
