import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, ScrollView, TextInput, Alert, TouchableOpacity } from 'react-native';
import { obtenerUsuarioPorId, actualizarUsuario } from '../services/usuarioService'; 
import { useAuth } from '../context/AuthContext';

export default function ModificarUsuario() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { userInfo } = useAuth();

  const [loading, setLoading] = useState(true);
  const [usuario, setUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    usuario: '',
    contrasenia: '',
    perfil_id:'',
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const datos = await obtenerUsuarioPorId(Number(id)); 
        setUsuario(datos);
      } catch (error) {
        Alert.alert('Error', 'No se pudo cargar el usuario');
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  const handleChange = (campo: string, valor: string) => {
    setUsuario(prev => ({ ...prev, [campo]: valor }));
  };

  const handleGuardar = async () => {
    try {
      await actualizarUsuario(Number(id), usuario); 
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el Perfil');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Modificar Pasajero</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={usuario.nombre}
        onChangeText={text => handleChange('nombre', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Apellido"
        value={usuario.apellido}
        onChangeText={text => handleChange('apellido', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Emali"
        value={usuario.email}
        onChangeText={text => handleChange('email', text)}
        
      />

      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        value={usuario.telefono}
        onChangeText={text => handleChange('telefono', text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={usuario.usuario}
        onChangeText={text => handleChange('usuario', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={usuario.contrasenia}
        onChangeText={text => handleChange('contrasenia', text)}
      />

     

      <TouchableOpacity style={styles.button} onPress={handleGuardar}>
        <Text style={styles.buttonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
