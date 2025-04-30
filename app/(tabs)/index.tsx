import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from '../login';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';


export default function Index() {
  const { logout } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
  }, []);

  const handleLogout = async () => {
    
    await logout();
    setIsLoggedIn(false);
  };

  if (isLoggedIn === null) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  } 

  if (!isLoggedIn) {
    return <Login onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla index</Text>
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
