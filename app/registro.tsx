import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, useColorScheme } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

// Definir el tipo para los errores
type Errores = {
  nombre?: string;
  apellido?: string;
  dni?: string;
  telefono?: string;
  email?: string;
  usuario?: string;
  contrasenia?: string;
  perfil_id?: string;
};

export default function RegistroScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dni, setDni] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [perfil_id, setPerfil_id] = useState('');
  const [errores, setErrores] = useState<Errores>({});  // Especificar el tipo de errores

  const isDark = colorScheme === 'dark';

  const handleRegistro = async () => {
    console.log('Registrando usuario:', { nombre, apellido, dni, telefono, email, usuario, contrasenia, perfil_id });
    const payload = {
      nombre,
      apellido,
      dni,
      telefono,
      email,
      usuario,
      contrasenia,
      perfil_id,
    };

    try {
      const response = await axios.post('http://192.168.0.11:3000/usuarios/crearUsuario', payload);
      const { token, perfil } = response.data;
      console.log(token);
      console.log(perfil);
      router.push('/');
    } catch (error: any) {
      console.error('Error al registrarse:', error.response?.data || error.message);
      const backendErrors = error.response?.data?.errores;
      if (backendErrors) {
        setErrores(backendErrors);
      } else {
        const mensaje = error.response?.data?.mensaje || 'Error al registrarse';
        alert(mensaje);
      }
    }
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
    errorText: {
      color: 'red',
      fontSize: 12,
      marginTop: 5,
    },
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Registrarse</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          value={nombre}
          onChangeText={(text) => { setNombre(text); setErrores((prev: Errores) => ({ ...prev, nombre: '' })); }}
        />
        {errores.nombre && <Text style={styles.errorText}>{errores.nombre}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Apellido"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          value={apellido}
          onChangeText={(text) => { setApellido(text); setErrores((prev: Errores) => ({ ...prev, apellido: '' })); }}
        />
        {errores.apellido && <Text style={styles.errorText}>{errores.apellido}</Text>}

        <TextInput
          style={styles.input}
          placeholder="DNI"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          value={dni}
          onChangeText={(text) => { setDni(text); setErrores((prev: Errores) => ({ ...prev, dni: '' })); }}
        />
        {errores.dni && <Text style={styles.errorText}>{errores.dni}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Telefono"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          value={telefono}
          onChangeText={(text) => { setTelefono(text); setErrores((prev: Errores) => ({ ...prev, telefono: '' })); }}
        />
        {errores.telefono && <Text style={styles.errorText}>{errores.telefono}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          value={email}
          onChangeText={(text) => { setEmail(text); setErrores((prev: Errores) => ({ ...prev, email: '' })); }}
        />
        {errores.email && <Text style={styles.errorText}>{errores.email}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Usuario"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          value={usuario}
          onChangeText={(text) => { setUsuario(text); setErrores((prev: Errores) => ({ ...prev, usuario: '' })); }}
        />
        {errores.usuario && <Text style={styles.errorText}>{errores.usuario}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          secureTextEntry
          value={contrasenia}
          onChangeText={(text) => { setContrasenia(text); setErrores((prev: Errores) => ({ ...prev, contrasenia: '' })); }}
        />
        {errores.contrasenia && <Text style={styles.errorText}>{errores.contrasenia}</Text>}

        <TextInput
          style={styles.input}
          placeholder="Perfil"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          value={perfil_id}
          onChangeText={(text) => { setPerfil_id(text); setErrores((prev: Errores) => ({ ...prev, perfil_id: '' })); }}
        />
        {errores.perfil_id && <Text style={styles.errorText}>{errores.perfil_id}</Text>}

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
