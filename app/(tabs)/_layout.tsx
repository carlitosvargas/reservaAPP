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
              case 'empresaUsuarios':
              iconName = 'people';
              break;
            case 'choferViajes':
              iconName = 'bus';
              break;
            case 'listarReservas':
              iconName = 'calendar';
              break;
            case 'listarViajes':
              iconName = 'map';
              break;
            case 'listarTransportes':
              iconName = 'bus';
              break;
            case 'crearEmpresa':
              iconName = 'bus';
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
     
      <Tabs.Screen 
       name="reserva" 
       options={{ 
        title: 'Reservas',
        href: (userInfo?.perfil === 'usuarioCliente') ? undefined : null,
        lazy: true,
        }} />
      
      <Tabs.Screen 
       name="viajes" 
       options={{
         title: 'Viajes',
         href: (userInfo?.perfil === 'usuarioCliente') ? undefined : null,
        lazy: true,
        }} />

        <Tabs.Screen 
       name="crearEmpresa" 
       options={{ 
        title: 'Empresa',
        href: (userInfo?.perfil === 'usuarioAdministrador') ? undefined : null,
        lazy: true,
        }} />
     

    
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
       <Tabs.Screen
        name="listarReservas"
        options={{
          title: 'Reservas',
          href: (userInfo?.perfil === 'usuarioEmpresa' || userInfo?.perfil === 'usuarioMostrador') ? undefined : null,
          lazy: true,
        }}
      />
         <Tabs.Screen
        name="listarViajes"
        options={{
          title: 'Viajes',
          href: (userInfo?.perfil === 'usuarioEmpresa' || userInfo?.perfil === 'usuarioMostrador') ? undefined : null,
          lazy: true,
        }}
      />
       <Tabs.Screen
        name="listarTransportes"
        options={{
          title: 'Transportes',
          href: (userInfo?.perfil === 'usuarioEmpresa' || userInfo?.perfil === 'usuarioMostrador') ? undefined : null,
          lazy: true,
        }}
      />
      <Tabs.Screen
        name="empresaUsuarios"
        options={{
          title: 'Usuarios',
          href: userInfo?.perfil === 'usuarioEmpresa' ? undefined : null,
          lazy: true,
        }}
      />
      <Tabs.Screen name="perfil" options={{ title: 'Perfil' }} />
    </Tabs>
  );
}
