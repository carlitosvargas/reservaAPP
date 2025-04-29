import React from 'react'; 
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Inicio' , href:null}} />
      <Tabs.Screen name="index" options={{ title: 'Iniciar Sesión' }} />
      <Tabs.Screen name="login" options={{ title: 'login' , href:null}} />
   
    </Tabs>
  );
}
