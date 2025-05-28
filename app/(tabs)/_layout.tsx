import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const { isLoggedIn, isLoading, userInfo } = useAuth();

  if (isLoading) return null;
  if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#000' },
        headerTintColor: '#007AFF',
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#888',
        tabBarActiveBackgroundColor: '#000',
        tabBarInactiveBackgroundColor: '#111',
        tabBarStyle: { borderTopColor: '#333' },
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';

          switch (route.name) {
            case 'index':
              iconName = 'home';
              break;
            case 'reserva':
              iconName = 'calendar';
              break;
            case 'viajes':
              iconName = 'bus';
              break;
            case 'perfil':
              iconName = 'person';
              break;
            case 'usuarios':
              iconName = 'people';
              break;
            case 'choferViajes':
              iconName = 'bus';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="reserva" options={{ title: 'Reservas' }} />
      <Tabs.Screen name="viajes" options={{ title: 'Viajes' }} />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />

    
      <Tabs.Screen
        name="usuarios"
        options={{
          title: 'Usuarios',
          href: userInfo?.perfil === 'usuarioAdministrador' ? undefined : null,
          lazy: true,
        }}
      />
       <Tabs.Screen
        name="choferViajes"
        options={{
          title: 'Viajes',
          href: userInfo?.perfil === 'usuarioChofer' ? undefined : null,
          lazy: true,
        }}
      />
    </Tabs>
  );
}
