import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '../context/AuthContext';


export default function TabLayout() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return null; 

  if (!isLoggedIn) return <Redirect href="/login" />;

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
      <Tabs.Screen name="index" options={{ title: 'Inicio'}} />
      <Tabs.Screen name="reserva" options={{ title: 'Reservar' }} />
      <Tabs.Screen name="viajes" options={{ title: 'Viajes' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
    </Tabs>
  );
}
