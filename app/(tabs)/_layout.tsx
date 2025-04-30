import React, { useEffect, useState } from 'react';
import { Tabs, Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkLogin();
  }, []);

  if (isLoggedIn === null) return null; // o un loader si quieres

  

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#007AFF',
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
        tabBarActiveBackgroundColor: '#000',
        tabBarInactiveBackgroundColor: '#111',
        tabBarStyle: { borderTopColor: '#333' },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="reserva" options={{ title: 'Reservar' }} />
      <Tabs.Screen name="viajes" options={{ title: 'Viajes' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
