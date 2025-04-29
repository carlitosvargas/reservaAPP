import { useRouter } from 'expo-router';
import { Button, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View>
      <Button title="Ir a Reserva" onPress={() => router.push('/screens/reserva')} />
    </View>
  );
}
