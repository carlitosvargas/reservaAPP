import React from 'react';
import {View,Text,ImageBackground,StyleSheet,Pressable,ActivityIndicator,Dimensions,} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Login from '../login';

const { width, height } = Dimensions.get('window');

export default function Index() {
 

  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => {}} />;
  }

  return (
    <ImageBackground
      source={require('../../assets/images/fondo.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>V&V Reservas</Text>
        <Text style={styles.subtitle}>Tu viaje comienza aquí</Text>
        <Pressable
          style={styles.button}
          onPress={() => router.push('/(tabs)/viajes')}
        >
          <Text style={styles.buttonText}>Reservar ahora</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    width: width,
    height: height,
    justifyContent: 'center',
  },
  
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#ddd',
    marginBottom: 32,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});