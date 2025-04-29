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


export default function ReservaLayout() {
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
    }}>
      <Tabs.Screen name="reserva" options={{ title: 'Reserva' }} />
      <Tabs.Screen name="registro" options={{ title: 'Registro' }} />
    </Tabs>
  );
}
