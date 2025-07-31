import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, useColorScheme, KeyboardAvoidingView, Platform, ScrollView,} from 'react-native';
import { useRouter } from 'expo-router';
import { enviarEmailRecuperacion } from '../services/authService';

export default function RecuperarContrasenia() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const colorScheme = useColorScheme();
  const router = useRouter();

  const isDark = colorScheme === 'dark';

  const handleRecuperar = async () => {
    setError('');
    setMensaje('');

    if (!email || !email.includes('@')) {
      setError('Por favor, ingresá un email válido.');
      return;
    }

    try {
      let plataforma = ''

      if (Platform.OS === 'web') {
         plataforma = 'web'
          console.log('Está restableciendo desde la web', plataforma);
      } else {
         plataforma = 'movil'
          console.log('Está restableciendo desde la app móvil', plataforma );
      }

       await enviarEmailRecuperacion(email, plataforma);

      setMensaje('Si el correo está registrado, recibirás un enlace para restablecer la contraseña.');
    } catch (err) {
      console.error(err);
      setError('Hubo un problema al intentar enviar el correo.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles(isDark).wrapper} keyboardShouldPersistTaps="handled">
        <View style={styles(isDark).formContainer}>
          <Text style={styles(isDark).title}>Recuperar contraseña</Text>

          <TextInput
            style={styles(isDark).input}
            placeholder="Ingresá tu correo electrónico"
            placeholderTextColor={isDark ? '#ccc' : '#888'}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          {error !== '' && <Text style={styles(isDark).error}>{error}</Text>}
          {mensaje !== '' && <Text style={styles(isDark).mensaje}>{mensaje}</Text>}

          <Pressable style={styles(isDark).button} onPress={handleRecuperar}>
            <Text style={styles(isDark).buttonText}>Enviar</Text>
          </Pressable>

          <Text style={styles(isDark).volverLink}>
            ¿Ya recordaste tu contraseña?{' '}
            <Text style={styles(isDark).linkText} onPress={() => router.replace('/login')}>
              Iniciar sesión
            </Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = (isDark: boolean) =>
  StyleSheet.create({
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
      fontSize: 22,
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
      marginBottom: 12,
      paddingHorizontal: 12,
      color: isDark ? '#fff' : '#000',
      backgroundColor: isDark ? '#1a1a1a' : '#fff',
    },
    button: {
      backgroundColor: '#4c68d7',
      paddingVertical: 12,
      borderRadius: 20,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
    error: {
      color: 'red',
      marginBottom: 10,
      textAlign: 'center',
    },
    mensaje: {
      color: 'green',
      marginBottom: 10,
      textAlign: 'center',
    },
    volverLink: {
      marginTop: 20,
      textAlign: 'center',
      color: isDark ? '#aaa' : '#444',
    },
    linkText: {
      color: '#007AFF',
      fontWeight: 'bold',
    },
  });
