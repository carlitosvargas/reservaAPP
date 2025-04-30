// components/NavBar.tsx
import React from 'react';
import { View, Text, Pressable, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../app/context/AuthContext';

export default function NavBar() {
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  return (
    <View style={styles.navbar}>
      <Image
        source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg' }}
        style={styles.logo}
      />
      <View style={styles.links}>
        {isAuthenticated ? (
          <Pressable onPress={async () => {
            await logout();
            router.replace('/login'); 
          }}>
            <Text style={styles.linkText}>Cerrar sesión</Text>
          </Pressable>
        ) : (
          <>
            <Pressable onPress={() => router.replace('/login')}>
              <Text style={styles.linkText}>Iniciar sesión</Text>
            </Pressable>
            <Pressable onPress={() => router.replace('/registro')}>
              <Text style={styles.linkText}>Registrarse</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#007AFF',
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  links: {
    flexDirection: 'row',
    gap: 20,
  },
  linkText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 16,
  },
});
