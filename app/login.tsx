import React, { useState, useRef } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../context/AuthContext';
import { loginUsuario } from '../services/authService';
import { Ionicons } from '@expo/vector-icons'; // 👈 Importación del ícono

export default function LoginScreen({ onLoginSuccess }: { onLoginSuccess?: () => void }) {
  const { login } = useAuth();
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [usuario, setUsuario] = useState('');
  const [contrasenia, setPassword] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false); // 👈 Nuevo estado

  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    try {
      const { token } = await loginUsuario(usuario, contrasenia);
      await login(token);
      await AsyncStorage.setItem('token', token);
      console.log(token);

      if (onLoginSuccess) {
        onLoginSuccess();
      }

      router.replace('/(tabs)');
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error.response?.data || error.message);
      const mensaje = error.response?.data?.mensaje || 'Usuario o contraseña incorrectos';
      setErrorMensaje(mensaje);
    }
  };

  const handleUsuarioChange = (text: string) => {
    setUsuario(text);
    if (errorMensaje !== '') setErrorMensaje('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (errorMensaje !== '') setErrorMensaje('');
  };

  const isDark = colorScheme === 'dark';

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
      maxWidth: 360,
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
      backgroundColor: '#4c68d7',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      transform: [{ scale: 1 }],
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
      letterSpacing: 0.5,
    },
    registroLink: {
      marginTop: 16,
      textAlign: 'center',
      color: isDark ? '#aaa' : '#444',
    },
    linkText: {
      color: '#007AFF',
      fontWeight: 'bold',
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 0}
    >
      <ScrollView contentContainerStyle={styles.wrapper} keyboardShouldPersistTaps="handled">
        <View style={styles.formContainer}>
          <Text style={styles.title}>Iniciar sesión</Text>

          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor={isDark ? '#ccc' : '#888'}
            value={usuario}
            onChangeText={handleUsuarioChange}
            returnKeyType="next"
            onSubmitEditing={() => passwordInputRef.current?.focus()}
          />

          <View style={{ position: 'relative' }}>
            <TextInput
              ref={passwordInputRef}
              style={[styles.input, { paddingRight: 40 }]} // espacio para el ícono
              placeholder="Contraseña"
              placeholderTextColor={isDark ? '#ccc' : '#888'}
              secureTextEntry={!mostrarPassword}
              value={contrasenia}
              onChangeText={handlePasswordChange}
              onSubmitEditing={handleLogin}
              returnKeyType="done"
            />
            <Pressable
              onPress={() => setMostrarPassword(!mostrarPassword)}
              style={{
                position: 'absolute',
                right: 10,
                top: 12,
              }}
            >
              <Ionicons
                name={mostrarPassword ? 'eye-off' : 'eye'}
                size={22}
                color={isDark ? '#ccc' : '#555'}
              />
            </Pressable>
          </View>

          {errorMensaje !== '' && (
            <Text style={{ color: 'red', marginBottom: 10, textAlign: 'center' }}>
              {errorMensaje}
            </Text>
          )}

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </Pressable>

          <Text style={styles.registroLink}>
            ¿No tenés cuenta?{' '}
            <Text style={styles.linkText} onPress={() => router.push('/registro')}>
              Registrarse
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}