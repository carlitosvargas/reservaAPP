import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { Ionicons, Octicons, MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  const { isLoggedIn, isLoading, userInfo } = useAuth();

  if (isLoading) return null;
  if (!isLoggedIn) return <Redirect href="/login" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
      tabBarShowLabel: false,
      headerStyle: { backgroundColor: '#000' },
      headerTintColor: '#007AFF',
      tabBarActiveTintColor: '#007AFF',
      tabBarInactiveTintColor: '#888',
      headerShown: false,
      tabBarStyle: {
        position: 'relative', 
        bottom: 20,           
        left: 0,
        right: 20,
        backgroundColor: '#111',
        borderTopColor: '#111',
        height: 65,
        paddingBottom: 8,
        paddingTop: 6,
        borderRadius: 0,
        elevation: 10,
        shadowColor: '#111',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: -1 },
        shadowRadius: 2,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 1,
      },
      tabBarIconStyle: {
        marginTop: 4,
      },
      tabBarIcon: ({ color, size }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

  switch (route.name) {
    case 'index':
      iconName = 'home-outline';
      break;
    case 'reserva':
      iconName = 'calendar-outline';
      break;
    case 'viajes':
      iconName = 'navigate-outline';
      break;
    case 'perfil':
      iconName = 'person-circle-outline';
      break;
    case 'usuarios':
    case 'empresaUsuarios':
      iconName = 'people-outline';
      break;
    case 'choferViajes':
    case 'listarViajes':
      iconName = 'trail-sign-outline';
      break;
    case 'choferReserva':
      iconName = 'reader-outline';
      break;
    case 'listarReservas':
      iconName = 'clipboard-outline';
      break;
    case 'listarTransportes':
      iconName = 'bus-outline';
      break;
    case 'crearEmpresa':
      iconName = 'business-outline';
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
        name="choferReserva"
        options={{
          title: 'Reservas',
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
      <Tabs.Screen name="perfil" options={{ title: 'Perfil', href:null }} />
    </Tabs>
  );
}