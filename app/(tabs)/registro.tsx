import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  useColorScheme,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function RegistroScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const isDark = colorScheme === 'dark';

  const handleRegistro = () => {
    console.log('Registrando usuario:', { nombre, apellido, email, usuario, password });
    // Acá podrías hacer la llamada a tu API
    router.replace('/login');
  };

  const styles = StyleSheet.create({
    wrapper: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#000' : '#fff',
      paddingHorizontal: 20,
    },
    formContainer: {
      width: '100%',
      maxWidth: 380,
      backgroundColor: isDark ? '#111' : '#f2f2f2',
      padding: 24,
      borderRadius: 12,
      elevation: 3,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#007AFF',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      height: 48,
      borderColor: '#007AFF',
      borderWidth: 1,
      borderRadius: 8,
      marginBottom: 14,
      paddingHorizontal: 12,
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
    },
    button: {
      backgroundColor: '#007AFF',
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 8,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    volverLogin: {
      marginTop: 16,
      textAlign: 'center',
      color: isDark ? '#aaa' : '#444',
    },
    volverLink: {
      color: '#007AFF',
      fontWeight: 'bold',
    },
  });
  

  return (
    <View style={styles.wrapper}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Registrarse</Text>
  
        <TextInput style={styles.input} placeholder="Nombre" placeholderTextColor={isDark ? '#ccc' : '#888'} value={nombre} onChangeText={setNombre} />
        <TextInput style={styles.input} placeholder="Apellido" placeholderTextColor={isDark ? '#ccc' : '#888'} value={apellido} onChangeText={setApellido} />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor={isDark ? '#ccc' : '#888'} value={email} onChangeText={setEmail} />
        <TextInput style={styles.input} placeholder="Usuario" placeholderTextColor={isDark ? '#ccc' : '#888'} value={usuario} onChangeText={setUsuario} />
        <TextInput style={styles.input} placeholder="Contraseña" placeholderTextColor={isDark ? '#ccc' : '#888'} secureTextEntry value={password} onChangeText={setPassword} />
  
        <Pressable style={styles.button} onPress={handleRegistro}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </Pressable>
  
        <Text style={styles.volverLogin}>
          ¿Ya tenés cuenta?{' '}
          <Text style={styles.volverLink} onPress={() => router.replace('/login')}>
            Iniciar sesión
          </Text>
        </Text>
      </View>
    </View>
  );
  
}
