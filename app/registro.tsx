import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, useColorScheme, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { registrarUsuario } from '../services/authService'; 


// Definir el tipo para los errores
type Errores = {
  nombre?: string;
  apellido?: string;
  dni?: string;
  telefono?: string;
  email?: string;
  usuario?: string;
  contrasenia?: string;
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
  const [errores, setErrores] = useState<Errores>({});  // Especificar el tipo de errores

  const isDark = colorScheme === 'dark';

  const handleRegistro = async () => {
    console.log('Registrando usuario:', { nombre, apellido, dni, telefono, email, usuario, contrasenia});
    const payload = {
      nombre,
      apellido,
      dni,
      telefono,
      email,
      usuario,
      contrasenia,
    };

    try {
      const response = await registrarUsuario(payload);
     Alert.alert('Éxito', 'Usuario registrado correctamente');
     setErrores({});
     router.replace('/login')
    }  catch (error: any) {
  if (Array.isArray(error.errors)) {
    // Convertimos el array de errores en un objeto { campo: mensaje }
    const erroresFormateados: Errores = {};
    error.errors.forEach((err: any) => {
      erroresFormateados[err.path as keyof Errores] = err.msg;
    });
    setErrores(erroresFormateados);
  } else if (error.mensaje) {
    Alert.alert('Error', error.mensaje);
  } else {
    Alert.alert('Error', 'Ocurrió un error inesperado');
  }
}

  };

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isDark ? '#000' : '#fff',
    paddingHorizontal: 20,
    paddingVertical: 40, // para espacio arriba/abajo
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
    <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
    
      <View style={styles.formContainer}>
        <Text style={styles.title}>Registrarse</Text>

      {errores.nombre && <Text style={styles.errorText}>{errores.nombre}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          value={nombre}
          onChangeText={(text) => { setNombre(text); setErrores((prev: Errores) => ({ ...prev, nombre: '' })); }}
        />
        
  {errores.apellido && <Text style={styles.errorText}>{errores.apellido}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Apellido"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          value={apellido}
          onChangeText={(text) => { setApellido(text); setErrores((prev: Errores) => ({ ...prev, apellido: '' })); }}
        />
      
      {errores.dni && <Text style={styles.errorText}>{errores.dni}</Text>}
        <TextInput
          style={styles.input}
          placeholder="DNI"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          value={dni}
          onChangeText={(text) => { setDni(text); setErrores((prev: Errores) => ({ ...prev, dni: '' })); }}
        />
        
        {errores.telefono && <Text style={styles.errorText}>{errores.telefono}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Telefono"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          value={telefono}
          onChangeText={(text) => { setTelefono(text); setErrores((prev: Errores) => ({ ...prev, telefono: '' })); }}
        />
        
  {errores.email && <Text style={styles.errorText}>{errores.email}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          value={email}
          onChangeText={(text) => { setEmail(text); setErrores((prev: Errores) => ({ ...prev, email: '' })); }}
        />
        
    {errores.usuario && <Text style={styles.errorText}>{errores.usuario}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          value={usuario}
          onChangeText={(text) => { setUsuario(text); setErrores((prev: Errores) => ({ ...prev, usuario: '' })); }}
        />
        
      {errores.contrasenia && <Text style={styles.errorText}>{errores.contrasenia}</Text>}
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          placeholderTextColor={isDark ? '#ccc' : '#888'}
          secureTextEntry
          value={contrasenia}
          onChangeText={(text) => { setContrasenia(text); setErrores((prev: Errores) => ({ ...prev, contrasenia: '' })); }}
        />
        
     

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
  
    </ScrollView>
  );
}
